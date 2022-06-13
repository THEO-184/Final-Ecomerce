require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParse = require("cookie-parser");
// routes imports
const authRouter = require("./routes/authRoutes");
// middleware imports
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.static("./public"));
app.use(cookieParse(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
// 	res.send("e-commerce-api");
// });
app.get("/api/v1", (req, res) => {
	console.log(req.signedCookies);
	res.send("djssjdd");
});
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// connect to database
const connectDB = require("./db/connect");
const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, () => {
			console.log(`server running on port ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
