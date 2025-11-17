
const Shift = require('../models/monitoring.models').Shift
let { DateTime } = require('luxon');




const getShiftSurfaceData = async (shift, limitValues) => {
	let speeds = []

	let result = {
		avg: 0,
		last: 0,
		sum: 0,
		speeds: [],
		piecesRecorded: [],
		startingTime: shift.startingTime,
		endingTime: shift.endingTime,
		createdAt: shift.createdAt,
		totPieces: shift.totPieces,
		model: shift.model,
		order: shift.order,
		_id: shift._id,
		max: 0,
		min: 0
	}

	if (shift.metrics.length > 0) {


		const begin = DateTime.fromISO(shift.startingTime.toISOString())
		const end = DateTime.now()
		const diff = end.diff(begin).milliseconds
		const minutes = (diff / (1000 * 60));


		const totPieces = shift.metrics[shift.metrics.length - 1].pieces

		const avgInMinute = ((totPieces / minutes) || 0).toFixed(1)

		shift.recordedSpeeds.push({speed: avgInMinute})

		await shift.save()

		shift.recordedSpeeds.forEach(m => {
			speeds.push(m.speed)
		})

		const max = Math.max(...speeds) ? Math.max(...speeds) : 0
		const min = Math.min(...speeds) ? Math.min(...speeds) : 0

		const last = speeds.length > 1 ? speeds[speeds.length - 1] : 0

		if (limitValues) speeds = speeds.slice(-(Math.min(speeds.length, limitValues)))

		let speedsSum = 0
		speeds.forEach(s => speedsSum += s)

		const avg = speeds.length > 0 ? speedsSum / speeds.length : 0

		return {...result, avg, last, speeds, max, min, sum: totPieces}
	} else {
		return result
	}
}

exports.instantPiecesInHours = async (beginMomentISO, endMomentISO, totPieces) => {

	let begin

	if (beginMomentISO){
		begin = DateTime.fromISO(beginMomentISO.toISOString())
	}else{
		let doc = await Shift.findOne({}, {}, {sort: {'createdAt': -1}}).exec()
		begin = DateTime.fromISO(doc.startingTime.toISOString())
		totPieces = await getShiftSurfaceData(doc, 10).sum
	}


	const end = endMomentISO ? DateTime.fromISO(endMomentISO.toISOString()) : DateTime.now()
	const diff = end.diff(begin).milliseconds
	const hours = (diff / (1000 * 60 * 60)) % 24;

	const piecesPerHours = totPieces/hours

	console.log(`Staring Date: ${begin}, ending date: ${end}, Diff: ${JSON.stringify(diff)}, hours: ${hours}, totPieces: ${totPieces}, pieces per hour ${piecesPerHours}`)

	return piecesPerHours
}


exports.piecesHoursInDay = async () => {

	const startDate = new Date()
	startDate.setHours(0,0,0,0)

	const endDate = new Date()
	endDate.setHours(23, 59,59,999)


	let err, docs = await Shift.find({
		startingTime: {$gte: startDate},
		$or: [
			{endingTime: {$lte: endDate}},
			{endingTime: null}
		]
	}).exec()

	if (err) {
		return console.log("Error in finding documents in day. E: ", err)
	}

	let sumInDay = 0

	if (docs){

		for (const d of docs) {
			const surface = await getShiftSurfaceData(d, 10)
			console.log(`Sum in day docs: [${JSON.stringify(surface)}]`)
			sumInDay += surface.sum
		}

		return sumInDay

	}else {
		return sumInDay
	}


}


exports.getShiftSurfaceData = getShiftSurfaceData
