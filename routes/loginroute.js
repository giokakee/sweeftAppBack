require("dotenv").config();
const router = require("express").Router();
const User = require("../schema/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/test", async (req, res) => {
	res.json(req.body);
});

router.post("/", async (req, res) => {
	try {
		if (req.body.token) {
			let userFromToken = await jwt.verify(req.body.token, process.env.SECRET);
			console.log("this is with token");
			return res.json({ token: req.body.token, username: userFromToken.username });
		}

		let user = await User.findOne({ username: req.body.username });
		let passwordIsCorrect = user === null ? false : await bcrypt.compare(req.body.password, user.password);

		if (!(user && passwordIsCorrect)) {
			return res.json(false);
		}

		let token = await jwt.sign(
			{
				username: user.username,
				id: user.id,
			},
			process.env.SECRET,
			{ expiresIn: 60 * 60 * 24 }
		);

		res.json({ token, username: user.username });
	} catch (err) {
		console.log({ message: err.message });
		res.json(false);
	}
});

module.exports = router;
