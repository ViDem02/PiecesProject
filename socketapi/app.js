let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')

const socketPort = process.env.PORT || 12000


//SOCKET STUFF

let {SocketHandler} = require('./socketHandler')
let server = require('http').createServer(express)
let io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_DOMAIN,
      methods: ["GET", "POST"],
      credentials: true
    }
})
server.listen(socketPort, () => {
  console.log(`Socket server listening on port ${socketPort}`)
})

let app = express()



// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
//app.use(bodyParser.json())


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

io.on('connection', (socket) => {
  SocketHandler(socket, io)
})

module.exports = app
