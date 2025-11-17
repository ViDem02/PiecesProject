const axios = require('axios');
require('dotenv').config()
//axios


const cache = null


const getLatestSurfaceData = async () => {
	const config = {
		headers: { Authorization: `Bearer ${process.env.INTERNAL_SECRET_TOKEN}` }
	};

	console.log(`Updating data!`)
	console.log(`Rest api: ${process.env.REST_API_DOMAIN}`)

	try {
		let res = await axios.get( process.env.REST_API_DOMAIN + '/last_element_surface/10', config)
		return res.data
	}catch (e) {
		console.log(`Error in connection to rest api: ${e}`)
		throw {
			readableError: "The server is not available right now",
			error: `Error in connection to rest api E: ${e}`
		}
	}
}


const SocketHandler = (socket, io) => {

	console.log(`CONNECTED id = ${socket.id}!`)


	socket.on('requestData', () => {
		if (cache){
			socket.emit('newData', cache)
		}else{
			getLatestSurfaceData().then(data => {
				socket.emit('newData', data)
			}).catch(e => {
				socket.emit('error', e)
			})
		}
	})

	io.on('restUp', () => {
		console.log("REST UP REST UP REST UP!");
	})


	socket.on('updateData', () => {
		getLatestSurfaceData().then((data) => {
			io.emit('newData', data)
		}).catch(e => {
			io.emit('error', e)
		})
	})

	socket.on('status', data => {
		console.log(`status: ${JSON.stringify(data)}`)
		io.emit('statusResponse', data)
	})

	socket.on('requestCheckStatus', () => {
		console.log(`REQUEST CHECK STATUS!`)
		io.emit('checkStatus')
	})

	socket.on('distance', (distance) => {
		console.log('DISTANCE!')
		io.emit('distanceBroadcast', distance)
	})

	io.on('disconnect', () => {
		console.log('disconnected!')
	})

	socket.on('calModeRequest', () => {
		console.log(`CAL MODE!`)
		io.emit('calMode')
	})

	socket.on('requestCalibrate', () => {
		io.emit('calibrate')
	})


	socket.on('requestStart', () => {
		io.emit('start')
	})

	socket.on('requestEnd', () => {
		io.emit('end')
	})

	socket.on('requestReboot', () => {
		console.log(`REBOOT!`)
		io.emit('reboot')
	})

	socket.on('requestHalt', () => {
		console.log(`HALT!`)
		io.emit('halt')
	})

	socket.on('requestPicture', () => {
		console.log(`PIC!`)
		io.emit('picture')
	})

	socket.on('pictureResponse', (message) => {
		console.log(`PIC AV!`)
		io.emit('pictureAvailable', message)
	})

	socket.on('pictureError', (message) => {
		console.log(`PIC ERR!`)
		io.emit('pictureErrorAvailable', message)
	})

}


module.exports = {SocketHandler}
