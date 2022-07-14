const router = require("express").Router();
const User = require("../schema/userschema");
const bcrypt = require("bcrypt");
const salt = 7;
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
	try {
		let allUser = await User.find({});

		res.json(allUser);
	} catch (err) {
		console.log({
			message: err.message,
		});
	}
});

router.post("/", async (req, res) => {
	try {
		let passwordHashed = await bcrypt.hash(req.body.password, salt);
		let user = new User({
			...req.body,
			password: passwordHashed,
		});

		await user.save();
		res.json(true);
	} catch (err) {
		console.log({
			message: err.message,
		});
		res.json(false);
	}
});

module.exports = router;
