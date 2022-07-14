const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
	addedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

contactSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash;
	},
});

// contactSchema.plugin(uniqueValidator)

module.exports = mongoose.model("Contact", contactSchema);
