const mongoose = require('mongoose')



const MetricsSchema = mongoose.Schema({
	pieces: Number,
}, {
	timestamps: true
})

const SpeedSchema = mongoose.Schema({
	speed: Number,
}, {
	timestamps: true
})

const ShiftSchema = mongoose.Schema({
	startingTime: { type : Date, default: Date.now },
	endingTime: { type : Date, },
	startMedia: Number,
	alias: String,
	metrics: {type: [MetricsSchema], default: []},
	recordedSpeeds: {type: [SpeedSchema], default: []},
	model: String,
	order: String,
	totPieces: Number,
}, {
	timestamps: true
})

const PictureGrantSchema = mongoose.Schema({
	allow: {type: Boolean, default: false},
	adminEmail: {type: String, required: true}
}, {
	timestamps: true
})


exports.Shift = mongoose.model('Shift', ShiftSchema)
exports.Metric = mongoose.model('Metric', MetricsSchema)
exports.PictureGrant = mongoose.model('PictureGrant', PictureGrantSchema)

