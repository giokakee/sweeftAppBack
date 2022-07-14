const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const callSchema = new mongoose.Schema(
	{
		calledBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		calledTo: String,
	},
	{
		timestamps: true,
	}
);

callSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash;
	},
});

// callSchema
// .plugin(uniqueValidator)

module.exports = mongoose.model("Call", callSchema);
