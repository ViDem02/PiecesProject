//STANDARD - TO BE CHANGED
const sanitizer = require('../sanitizers/shift.sanitizer')
const Element = require('../models/monitoring.models').Shift
const PictureGrant = require('../models/monitoring.models').PictureGrant
const io = require('socket.io-client')
const {DateTime} = require("luxon")
require('dotenv').config()
const {getShiftSurfaceData, piecesHoursInDay, instantPiecesInHours} = require('./dataManipolators')



//END - TO BE CHANGED


const updateSocketData = (req) => {
	console.log(`Using socketConn`)
	req.socketConn.emit('updateData')
}

const scoketSendMessage = (req, smsName, payload) => {
	req.socketConn.emit(smsName, payload)
}

const objectCreator = (req) => {
	let obj = {}
	Object.entries(req.body).forEach(([key, value]) => {
		console.log(`Req body: ${req.body}`)
		obj[key] = value
	})
	return obj
}

const handleError = (e, res) => {
	console.log(`Err: ${e}`)
	return res.status(500).send(e)
}


exports.getShiftSurfaceData = getShiftSurfaceData


// Create and Save a new Element
const createInDB = (req, res) => {
	// Validate request

	sanitizer.validCreation(req, res, () => {

		// Create a Element
		const element = new Element(objectCreator(req))

		// Save Element in the database
		element.save().then(data => {
			updateSocketData(req)
			res.status(200).send(data)
		}).catch(err => {
			return handleError(err, res)
		})
	})
}


exports.createInDB = createInDB


// Retrieve and return all elements from the database.
exports.findAll = (req, res) => {
	Element.find({}, {}, {sort: {'createdAt': -1}}, (err, docs) => {
		if (err) return res.status(500).send(err)
		res.status(200).send(docs)
	})
}


// Find a single element with a elementId
exports.findOne = (req, res) => {
	Element.findById(req.params.id)
		.then(element => {
			if (!element) {
				return res.status(404).send({
					message: "Element not found with id " + req.params.id
				})
			}
			res.status(200).send(element)
		}).catch(err => {
		if (err.kind === 'ObjectId') {
			return res.status(404).send({
				message: "Element not found with id " + req.params.id
			})
		}
		return res.status(500).send({
			message: "Error retrieving element with id " + req.params.id
		})
	})
}


// Update a element identified by the elementId in the request
exports.update = (req, res) => {

	sanitizer.validUpdate(req, res, () => {
		//Find element and update it with the request body

		const element = objectCreator(req)

		Element.findByIdAndUpdate(req.params.id, element, {new: true})
			.then(element => {
				if (!element) {
					return res.status(404).send({
						message: "Element not found with id " + req.params.id
					})
				}
				res.send(element)
			}).catch(err => {
			if (err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Element not found with id " + req.params.id + ": " + err
				})
			}
			return res.status(500).send({
				message: "Error updating element with id " + req.params.id + ": " + err
			})
		})
	})
}


// Delete a element with the specified elementId in the request
exports.remove = (req, res) => {
	Element.findByIdAndRemove(req.params.id)
		.then(element => {
			if (!element) {
				return res.status(404).send({
					message: "Element not found with the id " + req.params.id
				})
			}
			return res.status(200).send({
				message: "successfully deleted!"
			})
		}).catch(err => {
		if (err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: "Element not found with id " + req.params.id
			})
		}
		return res.status(500).send(({
			message: "Could not delete element with id " + req.params.id + " because of the error  = " + err
		}))
	})
}


exports.removeAll = (req, res) => {
	Element.remove({}, () => {
		return res.status(200).send({
			message: "deleted everything. REMEMBER TO DELETE ROUTE TO THIS FUNCTION!"
		})
	})
}


const addMetrics = async (req, res, next) => {

	Element.findOne({}, {}, {sort: {'createdAt': -1}}, async (err, shift) => {
		if (err) return res.status(500).send(err)

		if (shift.endingTime) return res.status(400).send({
			"error": "shift already ended!"
		})

		shift.metrics.push(req.body)
		await shift.save()

		updateSocketData(req)

		res.status(200).send("Added!")
	})
}

exports.addMetrics = addMetrics

const handleDistance = async(req, res, next) => {
	scoketSendMessage(req, 'distance', req.body.distance)
	res.status(200).send("Updated Distance!")
}


exports.newData = async (req, res, next) => {
	if (Object.entries(req.body).length > 1) return res.status(400).send({'error': 'only one data type at a time!'})
	if (req.body.pieces) return await addMetrics(req, res, next)
	if (req.body.distance) return await handleDistance(req, res, next)
	return res.status(400).send({'error': 'data type not recognized!'})
}




exports.endShift = async (req, res) => {
	scoketSendMessage(req, 'requestEnd')
	Element.findOne({}, {}, {sort: {'createdAt': -1}}, async (err, doc) => {
		if (err) {
			console.log(`Err: ${err}`)
			return res.status(500).send(err)
		}

		if (doc.endingTime) return res.status(400).send({
			"error": "shift already ended!"
		})
		doc.endingTime = req.body.endingTime ? req.body.endingTime : Date.now()
		await doc.save()

		updateSocketData(req)

		res.status(200).send(doc)
	})
}


exports.getLast = async (req, res) => {
	Element.findOne({}, {}, {sort: {'createdAt': -1}}, (err, doc) => {
		if (err) return handleError(err, res)
		res.status(200).send(doc)
	})
}

exports.getLastElementSurfaceData = async (req, res) => {

	const limit = req.params.limit

	Element.findOne({}, {}, {sort: {'createdAt': -1}}, async (err, doc) => {
		if (err) return handleError(err, res)
		if (!doc) return res.status(400).send({'error': 'no recordings!'})
		let surface = await getShiftSurfaceData(doc, limit)
		res.status(200).send(surface)
	})
}


exports.getShiftsSurfaceDataByDay = async (req, res) => {
	const limit = req.params.limit

	let result = null

	Element.find({}, {}, {sort: {'createdAt': -1}}, async (err, docs) => {
		if (err) return handleError(err, res)
		let result = []

		for (const e of docs) {
			let data = await getShiftSurfaceData(e, limit)
			let date = DateTime.fromISO(data.startingTime.toISOString())

			if (result.length === 0){
				result = [{
					dateOfRecords: date.day + "/" + date.month + "/" + date.year,
					data: [
						data
					]
				}]
			}else{
				let dateString = date.day + "/" + date.month + "/" + date.year

				let objWithDate
				result.forEach(r => {
					if (r.dateOfRecords === dateString) objWithDate = r
				})

				if (objWithDate){
					objWithDate.data.push(e)
				}else{
					result.push({
						dateOfRecords: dateString,
						data: [
							data
						]
					})
				}

			}
		}


		res.status(200).send(result)
	})
}


exports.getShiftsSurfaceData = async (req, res) => {

	let id = req.params.id
	const limit = req.params.limit

	if (id){
		try{
			let element = await Element.findById(req.params.id)
			let data = await getShiftSurfaceData(element, limit)
			res.status(200).send(data)
		}catch (e) {
			res.status(500).send({'error' : e})
		}
	}else {
		Element.find({}, {}, {sort: {'createdAt': -1}}, async (err, docs) => {
			if (err) return handleError(err, res)
			let result = []

			for (const e of docs) {
				let data = await getShiftSurfaceData(e, limit)
				result.push(data)
			}
			res.status(200).send(result)
		})
	}
}

exports.startShift = async (req, res) => {
	scoketSendMessage(req, 'requestStart')
	Element.findOne({}, {}, {sort: {'createdAt': -1}}, (err, doc) => {
		if (err) return handleError(err, res)

		if (doc) if (!doc.endingTime) {
			return res.status(400).send('Shift already started!')
		}

		createInDB(req, res)

	})
}

exports.getSensorStatus = async (req, res, dbConnected) => {
	let timeEnded = false
	let sent = false

	let response = [{
		device: 'restapi',
		status: true
	}, {
		device: 'socket',
		status: req.socketConn.connected
	},{
		device: 'raspberrypi',
		status: false
	},{
		device: 'arduino',
		status: false
	},{
		device: 'database',
		status: dbConnected
	},{
		device: 'auth',
		status: false
	}]

	const socket = await io(process.env.SOCKET_DOMAIN)
	socket.emit('requestCheckStatus')

	setTimeout(() => {
		timeEnded = true
		if (!sent) return res.status(200).send(response)
	}, 3000)

	socket.on('statusResponse', message => {
		response.forEach((r, key) => {
			message.forEach(m => {
				if (r.device === m.device){
					response[key] = m
				}
			})
		})
		console.log(`New status: ${JSON.stringify(response)}!`)
	})


}

exports.getLastShiftComprehensiveData = async (req, res) => {

	const pInH = await instantPiecesInHours()
	const pHiD = await piecesHoursInDay()

	res.status(200).send({
		instantPiecesInHours: pInH,
		piecesHoursInDay: pHiD,
	})
}


exports.toggleCalibrate = (req, res) => {
	scoketSendMessage(req, 'calModeRequest')
	res.send('Request sent to socket!')
}

exports.verifyToken = (req, res) => {
	if (req.decoded){
		res.status(200).send(req.decoded)
	}else{
		res.status(400).json({
			error: 'Token not valid!'
		})
	}
}

exports.releaseGrant = async (req, res) => {
	if (!req.decoded.isAdmin){
		return res.send(403).json({
			'error': 'operation not permitted!'
		})
	}
	let email = req.decoded.email
	let grant = new PictureGrant()
	grant.email = email
	grant.allow = req.body.allow
	await grant.save()
	return res.send(200).json(grant)
}

exports.permitStatus = async (req, res) => {
	PictureGrant.findOne({}, {}, {sort: {'createdAt': -1}}, (err, doc) => {
		if (!doc) return res.status(200).send({
			allow: false
		})
		if (err) return res.status(500).send({
			'error': err
		})

		res.status(200).send({
			allow: doc.allow
		})
	})
}

exports.getAllPermits = async (req, res) => {
	if (!req.decoded.isAdmin){
		return res.send(403).json({
			'error': 'operation not permitted!'
		})
	}
	PictureGrant.find({}, (err, docs) => {
		if (err) return res.status(500).send({
			'error': err
		})

		res.status(200).send({
			allow: doc.allow
		})
	})
}

