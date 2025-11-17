let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const io = require('socket.io-client')
const shiftsController = require("./controllers/shift.controller")
const Element = require('./models/monitoring.models').Shift
const controller = require('./controllers/shift.controller')
const axios = require("axios")
const auth = require("./middleware/jwt")

let dbConnected = false

const socketConn = io(process.env.SOCKET_DOMAIN)

const restPort = process.env.PORT || 8000

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
//app.use(bodyParser.json())
app.use(cors())

app.use((req, res, next) => {
	//console.log(`Mongoose.readyState = ${mongoose.connection.readyState}, ${req.originalUrl}`)
	if (mongoose.connection.readyState === 1 || req.originalUrl === '/status') {
		next()
	}else{
		res.status(500).send({'error': 'connection to DB not available'})
	}
})


app.use(function (req, res, next) {
	console.log(`Applied socketConn`)
	req.socketConn = socketConn
	next()
})


//REST API


app.get('/status', auth.checkToken, (req, res,) => shiftsController.getSensorStatus(req, res, dbConnected))


// Configuring the database
const mongoose = require('mongoose')

function connectToDB(){
	// Connecting to the database
	mongoose.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log("Successfully connected to the database")
		dbConnected = true
	}).catch(err => {
		console.log('Could not connect to the database. Exiting now...', err)
	})
}

connectToDB()

setInterval(() => {
	if (mongoose.connection.readyState !== 1){
		console.log('Reconnecting to db...')
		connectToDB()
	}
}, 15000)



require('./routes/std.routes.js')(app)

app.get('/', ((req, res) => {
	res.json({"message": "Welcome!"})
}))


app.listen(restPort, () => {
	console.log('REST server listening on ' + restPort)
	const io = require('socket.io-client')
	const socket = io(process.env.SOCKET_DOMAIN)
	socket.emit('restUp')
	socket.disconnect()
})

module.exports = app


Element.findOne({}, {}, {sort: {'createdAt': -1}}, async (err, doc) => {
	if (!doc) {
		console.log(`Creating new empty shift`)

		const config = {
			headers: { Authorization: `Bearer ${process.env.INTERNAL_SECRET_TOKEN}` }
		};

		await axios.post(`${process.env.OWN_DOMAIN}/start`, {}, config)

		await axios.post(`${process.env.OWN_DOMAIN}/end`, {}, config)

	}
})
