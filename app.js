require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParse = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");

// routes imports
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
// middleware imports
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_APIKEY,
	api_secret: process.env.CLOUD_SECRET,
});

app.use(express.static("./public"));
app.use(morgan("tiny"));
app.use(cookieParse(process.env.JWT_SECRET));
app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send("e-commerce-api");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/reviews", reviewRouter);

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
