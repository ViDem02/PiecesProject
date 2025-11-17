const express = require("express")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const bodyParser = require("body-parser")
const User = require('./models/user')
const io = require('socket.io-client')
const cors = require('cors')


const dotenv = require("dotenv")
dotenv.config()


//MongoDB config
require("./loaders/db")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cors())
app.use(logger("dev"))

const apiRoutes = require("./routes/apiRoutes")
app.use("/", apiRoutes)


app.listen(process.env.PORT)

User.find({}, (err, docs) => {
	if (docs.length === 0) {
		console.log(`Creating admin`)
		const user = new User()
		user.email = process.env.ADMIN_EMAIL
		user.password = user.encryptPassword(process.env.ADMIN_PASSWORD)
		user.created_At = Date.now()
		user.isAdmin = true
		user.save((error, result) => {
			if (error) {
				console.log(`err in admin creation`)
			} else {
				console.log(`admin created successfully`)
			}
		})
	}
})




const socket = io(process.env.SOCKET_DOMAIN)
console.log(`Connecting to socket ${process.env.SOCKET_DOMAIN}`)

socket.on('connect', () => {
	console.log(`Connected to socket`)
})

socket.on('checkStatus', () => {
	console.log(`Check status!`)
	socket.emit('status', [{
		'device': 'auth',
		'status': true
	}])
})
