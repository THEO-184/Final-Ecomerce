const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
} = require("../controller/productController");
const { getSingleProductReviews } = require("../controller/reviewController");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "../public/uploads");
	},

	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage });

const {
	authMiddleware,
	authorizePermissions,
} = require("../middleware/authentication");

router
	.route("/")
	.get(getAllProducts)
	.post([authMiddleware, authorizePermissions("admin")], createProduct);
router
	.route("/:id")
	.get(getSingleProduct)
	.patch([authMiddleware, authorizePermissions("admin")], updateProduct)
	.delete([authMiddleware, authorizePermissions("admin")], deleteProduct);
router
	.route("/uploadImage")
	.post([authMiddleware, authorizePermissions("admin")], uploadImage);

router.route("/:id/reviews").get(getSingleProductReviews);
module.exports = router;
