# MAT Remote Productivity Monitoring Platform

Comprehensive multi-service system for real-time remote monitoring of manufacturing productivity (pieces produced, speed metrics, shift lifecycle) integrating Arduino + Raspberry Pi hardware with a full web stack (REST APIs, WebSocket layer, Auth service, React client) and MongoDB Atlas persistence.

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           Client (React SPA)                               │
│  - UX for monitoring, calibration, users, shifts                           │
│  - Talks to REST API (metrics) & Auth API (identity) via HTTP              │
│  - Real-time updates via Socket.IO client                                  │
└───────────────▲────────────────────────────────┬───────────────────────────┘
                │                               │
          HTTP / JSON                      WebSocket events
                │                               │
        ┌───────┴────────┐        ┌─────────────┴────────────┐
        │  REST API       │        │      Socket API          │
        │  (metrics/shifts│◄──────►│  (event broker, fan-out) │
        └───────▲────────┘        └─────────────▲────────────┘
                │ Mongo queries                   │
                │                                 │ internal events
        ┌───────┴────────┐                        │
        │   MongoDB Atlas│                        │
        └───────▲────────┘                        │
                │                                 │
        ┌───────┴────────┐   Serial + Socket   ┌──┴───────────────────────┐
        │  Auth API       │◄──────────────────►│   Raspberry Pi Service   │
        │ (users/tokens)  │   (multithreading.py)                         │
        └─────────────────┘    │  │            └──────────────────────────┘ 
                               │  └─► Arduino (arduinoCode.ino)       │
                               └──── Sensor data -> REST / commands <-│
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Summary
1. Arduino measures production events (piece passages) and sends framed serial messages to the Raspberry Pi.
2. Raspberry Pi Python daemon parses messages and POSTs metrics to the REST API (`/new_arduino_data`).
3. REST API persists metrics inside the active Shift document, computes surface data, and emits `updateData` over Socket.IO.
4. Socket API broadcasts real-time updates to all connected clients (browser, services).
5. Client consumes REST endpoints for historical & aggregated data and live Socket events for instantaneous updates.
6. Auth API manages user provisioning, authentication (JWT), and admin-only lifecycle actions.

## 2. Repository Layout

| Directory        | Purpose |
|------------------|---------|
| `client/`        | React application (monitoring UI, calibration, user mgmt) |
| `restapi/`       | Metrics & shift management REST service (Express) |
| `auth/`          | Authentication & user administration service (Express) |
| `socketapi/`     | Socket.IO broker / event dispatcher |
| `arduino/mat-prk-arduino/` | Raspberry Pi daemon (`multithreading.py`) + Arduino sketch & systemd unit |
| `Documento di progetto.md` | Original Italian project document (context) |

## 3. Technology Stack

- Hardware: Arduino (C++ sketch), Raspberry Pi (Python 3, systemd service)
- Backend: Node.js (Express 4.x), Socket.IO ~2.x, Mongoose 5.x
- Frontend: React 16.13 + Redux, Chart.js 3.x, Luxon time utilities
- Database: MongoDB Atlas (NoSQL for heterogeneous metric events)
- Auth: JWT (long-lived 365d tokens for users, internal service token)
- Realtime: Socket.IO events bridging services and clients
- Orchestration (edge): systemd unit to auto-start Pi daemon

## 4. Data Model (MongoDB)

### Shift
```
Shift {
  _id: ObjectId,
  startingTime: Date,
  endingTime?: Date,
  startMedia?: Number,
  alias?: String,
  metrics: [Metric],         // chronological pieces events
  recordedSpeeds: [Speed],   // optional speed samples
  model?: String,            // production model reference
  order?: String,            // order or batch identifier
  totPieces?: Number,        // cached total
  createdAt, updatedAt: Date (timestamps)
}
```
### Metric
```
Metric {
  pieces: Number,   // pieces counted in this event (typically incremental)
  createdAt, updatedAt: Date
}
```
### Speed (recordedSpeeds)
```
Speed {
  speed: Number,
  createdAt, updatedAt: Date
}
```
### PictureGrant
```
PictureGrant {
  allow: Boolean,
  adminEmail: String,
  createdAt, updatedAt: Date
}
```
### User
```
User {
  email: String (unique),
  password: String (bcrypt hash),
  created_at: Date,
  isAdmin: Boolean,
  tempPassword: Boolean // forces password change on first login
}
```

## 5. REST API (Metrics) Endpoints (`restapi`)
Secured by `Authorization: Bearer <JWT>` header unless internal token.

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/status` | Composite system status (REST, Socket, Pi, Arduino, DB, Auth) |
| GET    | `/shifts` | List all shifts (most recent first) |
| POST   | `/shifts` | Create new shift document (admin system action) |
| GET    | `/shifts/:id` | Fetch single shift |
| PUT    | `/shifts/:id` | Update shift fields |
| DELETE | `/shifts/:id` | Remove shift |
| POST   | `/add` | Append metric event to current (DEPRECATED in favor of `/new_arduino_data`) |
| POST   | `/new_arduino_data` | Add metric (`pieces`) or update distance reading |
| POST   | `/start` | Start new shift if previous ended |
| POST   | `/end` | Terminate active shift (add `endingTime`) |
| GET    | `/last` | Last shift document |
| GET    | `/surface` | Surface data of all shifts |
| GET    | `/surface/:limit` | Surface data limited metrics per shift |
| GET    | `/surface_by_id/:id` | Surface data for specific shift |
| GET    | `/last_element_surface` | Surface summary for last shift |
| GET    | `/last_element_surface/:limit` | Limited surface summary |
| GET    | `/details` | Instant & hourly aggregates (dashboard) |
| POST   | `/toggle_calmode` | Signal calibration mode via Socket |
| GET    | `/surface_by_day` | Shifts grouped by date |
| GET    | `/verify_token` | Validate provided token identity |

## 6. Auth API Endpoints (`auth`)

| Method | Path | Description |
|--------|------|-------------|
| POST   | `/login` | User login -> JWT, metadata |
| POST   | `/register` | Admin-only create user (temp password) |
| PUT    | `/change_password` | User password change (consumes temp) |
| GET    | `/users` | Admin list all users |
| GET    | `/user/:uid` | Admin fetch single user |
| DELETE | `/delete/:id` | Admin delete user; recreates admin if removed |
| DELETE | `/delete_all` | Danger: purge all users and recreate admin |
| GET    | `/verify` | JWT validity + decoded payload |

## 7. Socket API Events (`socketapi`)
The broker fans out events from services to all connected clients.

| Direction | Event | Payload | Purpose |
|-----------|-------|---------|---------|
| Pi/REST→Socket | `updateData` | surface data array | Notify clients of refreshed metrics |
| Client→Socket | `requestData` | none | Ask for latest surface snapshot |
| Socket→Client | `newData` | surface summary | Deliver metrics snapshot |
| Client→Socket | `requestStart` | none | Broadcast start shift (Pi + REST handles) |
| Client→Socket | `requestEnd` | none | Broadcast end shift |
| Client→Socket | `requestReboot` | none | Reboot Raspberry Pi |
| Client→Socket | `requestHalt` | none | Shutdown Raspberry Pi |
| Client→Socket | `requestCalibrate` | none | Trigger sensor calibration |
| Client→Socket | `calModeRequest` | none | Toggle calibration mode |
| Socket→Pi | `calMode`, `calibrate`, `start`, `end`, `reboot`, `halt` | none | Hardware control commands |
| Pi→Socket | `status` | device statuses | Health reporting |

## 8. Raspberry Pi Daemon (`multithreading.py`)
Responsibilities:
- Maintain resilient Socket.IO connection (auto-retry)
- Manage serial link to Arduino (`/dev/ARD_PORT_1`, 9600 baud)
- Parse framed messages (`$$...$$`) -> JSON -> POST to REST `/new_arduino_data`
- Forward calibration and lifecycle commands to Arduino
- Provide system `status` updates (Pi & Arduino connectivity, IP address)
- Log all actions to timestamped file under `/home/pi/MAT/logs/` for audit

Systemd unit (`mat.service`) ensures automatic restart on failure and boot-time activation.

## 9. Environment Variables (Sanitized)
Create `.env` files per service; do NOT commit secrets.

### `restapi/.env`
```
SOCKET_DOMAIN="http://localhost:12000"
OWN_DOMAIN="http://localhost:8000"
SECRET="<jwt_user_secret>"
INTERNAL_SECRET_TOKEN="<internal_service_token>"  # shared with Pi & socket
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
PORT=8000
```
### `auth/.env`
```
PORT=15000
SECRET="<jwt_user_secret>"  # match REST for cross-service validation
MONGODB="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="ChangeMeNow!"   # initial temp admin password
SOCKET_DOMAIN="http://localhost:12000"
```
### `socketapi/.env`
```
REST_API_DOMAIN="http://localhost:8000"
CLIENT_DOMAIN="http://localhost:3000"
INTERNAL_SECRET_TOKEN="<internal_service_token>"
PORT=12000
```
### `client/.env`
```
REACT_APP_API_LINK="http://localhost:8000"
REACT_APP_SOCKET_LINK="http://localhost:12000"
REACT_APP_AUTH_LINK="http://localhost:15000"
REACT_APP_USE_FAKE_REST_API=false
```
### Raspberry Pi JSON Configs
- `addresses.local.json`: local REST & Socket roots
- `secrets.json`: `{"token": "<internal_service_token>"}`

## 10. Local Development Setup

### Prerequisites
- Node.js 12.x (to match service `engines` requirement) or later (verify compatibility)
- npm 6+
- Python 3.x (for Pi-only service; local mocking optional)
- MongoDB Atlas cluster or local MongoDB instance

### Monorepo Install
From repository root:
```bash
# Install dependencies for each Node.js service
npm --prefix restapi install
npm --prefix auth install
npm --prefix socketapi install
npm --prefix client install
```

### Start Order (recommended)
```bash
# 1. Socket broker
npm --prefix socketapi run dev
# 2. REST metrics API
npm --prefix restapi run dev
# 3. Auth API
npm --prefix auth run dev
# 4. React client (in separate terminal)
npm --prefix client run start
```

React dev server defaults to `http://localhost:3000`. Confirm ports align with `.env` variables.

### Quick Health Checks
```bash
curl -H "Authorization: Bearer <JWT_OR_INTERNAL_TOKEN>" http://localhost:8000/status
curl -H "Authorization: Bearer <JWT>" http://localhost:8000/last
curl -H "Authorization: Bearer <JWT>" http://localhost:15000/verify
```

### Start New Shift & Add Metric (Simulated)
```bash
# Start shift
curl -X POST -H "Authorization: Bearer <JWT_OR_INTERNAL_TOKEN>" http://localhost:8000/start
# Simulate piece metric
curl -X POST -H "Authorization: Bearer <JWT_OR_INTERNAL_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"pieces":1}' http://localhost:8000/new_arduino_data
```

### End Shift
```bash
curl -X POST -H "Authorization: Bearer <JWT_OR_INTERNAL_TOKEN>" http://localhost:8000/end
```

### User Lifecycle
```bash
# Login
curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"ChangeMeNow!"}' \
     http://localhost:15000/login

# Register user (admin token required)
curl -X POST -H "Authorization: Bearer <ADMIN_JWT>" -H "Content-Type: application/json" \
     -d '{"email":"operator@example.com","password":"Temp123!","isAdmin":false}' \
     http://localhost:15000/register
```

## 11. Command Validation Notes
All above `npm --prefix <service> run <script>` usages map to scripts present in each `package.json` (verified via grep). `curl` endpoints correspond to exposed routes in `restapi/routes/std.routes.js` and `auth/routes/apiRoutes.js`.

## 12. Authentication & Authorization
- JWT created by Auth API with claims: `email`, `userId`, `admin`.
- Internal service token (`INTERNAL_SECRET_TOKEN`) grants privileged REST access for automated system actions without full JWT cycle.
- Password flow: Admin creates user with temp password (`tempPassword=true`); user must change it via `/change_password`.

## 13. Realtime Layer Details
- Client requests fresh data: emits `requestData`; server responds with `newData` (surface metrics).
- REST emits `updateData` after mutations adding metrics or altering shift state.
- Hardware control commands propagate from client events to Pi & Arduino through broker.

## 14. Raspberry Pi Deployment
1. Copy daemon files to `/home/pi/MAT/` (`multithreading.py`, JSON configs, `secrets.json`).
2. Install Python deps: `pip install requests python-socketio pyserial`.
3. Enable service:
```bash
sudo cp mat.service /etc/systemd/system/mat.service
sudo systemctl daemon-reload
sudo systemctl enable mat.service
sudo systemctl start mat.service
sudo systemctl status mat.service
```

## 15. Logging & Observability
- Pi: rotated per-run log file named with start timestamp in `/home/pi/MAT/logs/`.
- REST/Socket/Auth: Morgan request logging (dev format). Extend with centralized logging aggregation for production.

## 16. Error Handling & Resilience
- Pi daemon auto-reconnect loops for serial & Socket; exponential backoff can be added.
- REST DB reconnection poll (`setInterval` every 15s) ensures database outages are recovered.
- systemd `Restart=on-failure` ensures daemon resiliency.

## 17. Security Considerations
- Replace hard-coded example secrets with strong, unique values.
- Restrict internal token scope; rotate periodically.
- Enforce HTTPS termination (reverse proxy: Nginx / Traefik) for all external services.
- Consider reducing JWT expiry or implementing refresh token strategy.
- Validate and sanitize additional incoming fields (currently basic validation in sanitizer & Joi usage can be expanded).

## 18. Potential Improvements
- Migrate Socket.IO to v4 and adopt namespace separation (hardware vs client consumers).
- Introduce rate limiting & request validation schemas (Joi) uniformly.
- Add automated tests (unit + integration) for controllers & reducers.
- Containerize services (Docker) for reproducible deployments.
- Add CI pipeline (GitHub Actions) for lint, test, build.
- Implement metrics aggregation layer (e.g., Prometheus exporters for service health).

## 19. Running Tests (Client)
Client includes baseline React tests. After install:
```bash
npm --prefix client test -- --watchAll=false
```

## 20. License / Usage
Project provided as educational portfolio material. Remove real credentials and sanitize proprietary data before public publishing.

---
For questions or extensions (Dockerization, CI/CD, security hardening) open an issue or contact the maintainer.
