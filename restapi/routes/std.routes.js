const shiftsController = require('../controllers/shift.controller')
const auth = require("../middleware/jwt")

module.exports = (app) => {


	app.route('/shifts')
		.get(auth.checkToken, shiftsController.findAll)
		.post(auth.checkToken, shiftsController.createInDB)

	app.route('/shifts/:id')
		.get(auth.checkToken, shiftsController.findOne)
		.put(auth.checkToken, shiftsController.update)
		.delete(auth.checkToken, shiftsController.remove)

	app.post('/add', auth.checkToken,  shiftsController.addMetrics)

	app.post('/new_arduino_data', auth.checkToken, shiftsController.newData)

	app.post('/end', auth.checkToken, shiftsController.endShift)

	app.get('/last', auth.checkToken, shiftsController.getLast)

	app.get('/surface', auth.checkToken, shiftsController.getShiftsSurfaceData)

	app.get('/surface/:limit', auth.checkToken, shiftsController.getShiftsSurfaceData)

	app.get('/surface_by_id/:id', auth.checkToken, shiftsController.getShiftsSurfaceData)

	app.get('/last_element_surface', auth.checkToken, shiftsController.getLastElementSurfaceData)

	app.get('/last_element_surface/:limit', auth.checkToken, shiftsController.getLastElementSurfaceData)

	app.post('/start', auth.checkToken, shiftsController.startShift)

	app.get('/details', auth.checkToken, shiftsController.getLastShiftComprehensiveData)

	app.post('/toggle_calmode', auth.checkToken, shiftsController.toggleCalibrate)

	app.get('/surface_by_day', auth.checkToken, shiftsController.getShiftsSurfaceDataByDay)

	app.get('/verify_token', auth.checkToken, shiftsController.verifyToken)


	//Do not activate
	//app.delete('/deleteAll', auth.checkToken, shiftsController.removeAll)

}
