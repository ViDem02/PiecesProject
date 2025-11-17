const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const auth = require("../middleware/jwt")
require('dotenv').config()

const createAdmin = (req, res) => {
	console.log(`Creating admin`)
	const user = new User()
	user.email = process.env.ADMIN_EMAIL
	user.password = user.encryptPassword(process.env.ADMIN_PASSWORD)
	user.created_At = Date.now()
	user.isAdmin = true
	user.save((result, error) => {
		if (error) {
			console.log(`couldn't create superuser`)
			return res.status(500).send({
				message: "deleted everything. didn't created superuser"
			})
		}
		console.log(`created superuser`)
		return res.status(200).send({
			message: "created superuser"
		})
	})
}

exports.createAdmin = createAdmin

router.get("/", (req, res) => {
	res.status(201).json({
		message: "Welcome to the API."
	})
})

router.put('/change_password', auth.checkToken, (req, res) => {
	if (!req.body.password || !req.body.newPassword){
		return res.status(400).json({
			error: 'newPassword and password needed'
		})
	}
	User.findOne({email:  req.decoded.email}, async (err, user) => {
		if (err) {
			console.log(err)
			return res.status(500).json({
				message: "Auth failed for server problem"
			})
		}
		if (!user.validPassword(req.body.password)) {
			return res.status(401).json({
				message: "Auth failed"
			})
		}

		console.log('Logged in, knows password')
		user.tempPassword = false
		user.password = user.encryptPassword(req.body.newPassword)
		await user.save()

		return res.status(200).json({
			message: 'changed successfully!'
		})

	})


})

router.post("/login", (req, res) => {
	if (!req.body.email || !req.body.password){
		return res.status(400).json({
			error: 'email and password needed'
		})
	}
	User.findOne({email: req.body.email}, function (err, user) {
		if (err) {
			console.log(err)
			return res.status(500).json({
				message: "Auth failed for server problem"
			})
		}
		if (!user) {
			console.log("No user found.")
			return res.status(401).json({
				message: "Auth failed"
			})
		}
		if (!user.validPassword(req.body.password)) {
			return res.status(401).json({
				message: "Auth failed"
			})
		}
		if (user) {
			console.log("logged in")

			const token = jwt.sign(
				{
					email: user.email,
					userId: user._id,
					admin: user.isAdmin
				},
				process.env.SECRET,
				{
					expiresIn: "365d"
				}
			)
			return res.status(200).json({
				message: "Auth successful",
				token: token,
				uid: user._id,
				admin: user.isAdmin,
				email: user.email,
				tempPassword: user.tempPassword
			})
		}
	}).catch(err => {
		console.log(err)
		res.status(500).json({
			error: err
		})
	})
})



router.post("/register", auth.checkAdmin, async (req, res) => {
	try {
		const user = new User()
		if (!req.body.email || !req.body.password) {
			res.status(400).json({
				error: 'Email and Password are needed'
			})
		}
		user.email = req.body.email
		user.password = user.encryptPassword(req.body.password)
		user.created_At = Date.now()
		user.isAdmin = req.body.isAdmin
		User.findOne({email: req.body.email}, function (err, foundUser) {
			if (foundUser){
				return res.status(400).json({
					message: "User registered with same email."
				})
			}
			user.save((error, result) => {
				if (error) {
					console.log(err)
					res.status(500).json({
						message: "An error has occured."
					})
				} else {
					res.status(201).json({
						message: "User created."
					})
				}
			})
		})
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: "An error has occured."
		})
	}
})

router.get("/user/:uid", auth.checkAdmin, (req, res) => {
	User.findOne({_id: req.params.uid}, function (err, user) {
		if (err) {
			console.log(err)
			return res.status(401).json({
				message: "User does not exist."
			})
		}
		if (user) {
			console.log("logged in")
			return res.status(200).json({
				message: "user found",
				uid: user._id,
				email: user.email,
				joined: user.created_At,
				isAdmin: user.isAdmin,
				tempPassword: user.tempPassword
			})
		}
	}).catch(err => {
		console.log(err)
		res.status(500).json({
			error: err
		})
	})
})


router.get("/users", auth.checkAdmin, (req, res) => {
	User.find({}, function (err, docs) {
		if (err) {
			console.log(err)
			return res.status(401).json({
				message: "ERROR"
			})
		}
		let result = []
		docs.forEach(user => {
			result.push({
				uid: user._id,
				email: user.email,
				joined: user.created_At,
				isAdmin: user.isAdmin,
				tempPassword: user.tempPassword,
			})
		})
		return res.status(200).json(result)
	}).catch(err => {
		console.log(err)
		res.status(500).json({
			error: err
		})
	})
})

router.get("/verify", auth.checkToken, (req, res) => {
	if (req.decoded){
		res.status(200).send(req.decoded)
	}else{
		res.status(400).json({
			error: 'Token not valid!'
		})
	}
})



router.delete("/delete_all", auth.checkAdmin, (req, res) => {
	User.remove({}, (error) => {
		console.log(`Creating admin`)
		const user = new User()
		user.email = process.env.ADMIN_EMAIL
		user.password = user.encryptPassword(process.env.ADMIN_PASSWORD)
		user.created_At = Date.now()
		user.isAdmin = true
		user.save((result, error) => {
			if (error) {
				return res.status(200).send({
					message: "deleted everything. created superuser"
				})
			} else {
				return res.status(500).send({
					message: "deleted everything. didn't created superuser"
				})
			}
		})
	})

})

router.delete("/delete/:id", auth.checkAdmin, (req, res) => {
	User.findByIdAndRemove(req.params.id)
		.then(element => {
			if (!element) {
				return res.status(404).send({
					message: "Element not found with the id " + req.params.id
				})
			}

			if (element.isAdmin === true){
				createAdmin(req, res)
			}

			return res.status(200).send({
				message: "successfully deleted!",
				justDeleted: element
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
})

module.exports = router
