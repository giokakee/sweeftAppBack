require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const registerRouter = require("./routes/registerroute");
const loginRouter = require("./routes/loginroute");
const contactRouter = require("./routes/contactrouter");

app.use(express.json());

mongoose.connect(process.env.URI, () => {
	console.log("Connected to mongoDB");
});

app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("------------------------------");
	next();
};
app.use(requestLogger);

app.use("/user/register", registerRouter);
app.use("/user/login", loginRouter);
app.use("/contact", contactRouter);

const unknownEndPoint = (req, res) => {
	res.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndPoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
