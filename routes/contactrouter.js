const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Contact = require("../schema/contactschema");
const User = require("../schema/userschema");
const Call = require("../schema/callSchema");

router.get("/all", async (req, res) => {
	try {
		let allContact = await Contact.find({}).populate("addedBy", { username: 1 });

		res.json(allContact);
	} catch (err) {
		res.json({ message: err.message });
	}
});

router.post("/byToken", async (req, res) => {
	try {
		let { id } = await jwt.verify(req.body.token, process.env.SECRET);
		let contactsById = await Contact.find({ addedBy: id });

		res.json(contactsById);
	} catch (err) {
		console.log({ message: err.message });
		res.json(false);
	}
});

router.post("/add", async (req, res) => {
	try {
		let { id } = await jwt.verify(req.body.token, process.env.SECRET);
		let user = await User.findById(id);
		let newContact = new Contact({ name: req.body.name, number: req.body.number, addedBy: id });

		user.contacts = [...user.contacts, newContact.id];

		await newContact.save();
		await user.save();

		res.json(newContact);
	} catch (err) {
		console.log({ message: err.message });
		res.json(false);
	}
});

router.delete("/delete", async (req, res) => {
	try {
		let { id } = await jwt.verify(req.body.token, process.env.SECRET);
		let user = await User.findById(id);

		await Contact.findByIdAndDelete(req.body.contactId);

		user.contacts = user.contacts.filter(contactId => contactId != req.body.contactId);

		await user.save();

		res.json(true);
	} catch (err) {
		console.log({ message: err.message });
		res.json(false);
	}
});

router.post("/edit", async (req, res) => {
	try {
		let updatedContact = await Contact.findByIdAndUpdate(req.body.id, { name: req.body.name, number: req.body.number });
		await updatedContact.save();
		console.log(updatedContact);
		res.json(updatedContact);
	} catch (err) {
		console.log({ message: err.message });
		res.json({ message: err.message });
	}
});

router.post("/call", async (req, res) => {
	try {
		let { id } = await jwt.verify(req.body.token, process.env.SECRET);

		let call = new Call({ calledBy: id, calledTo: req.body.calledTo });

		await call.save();
		res.json(call);
	} catch (err) {
		console.log({ message: err.message });
		res.json({ message: err.message });
	}
});

router.post("/call/history", async (req, res) => {
	try {
		let { id } = await jwt.verify(req.body.token, process.env.SECRET);

		let history = await Call.find({ calledBy: id });

		res.json(history);
	} catch (err) {
		console.log({ message: err.message });
		res.json({ message: err.message });
	}
});

module.exports = router;
