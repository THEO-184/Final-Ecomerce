const express = require("express");
const router = express.Router();
const {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
} = require("../controller/productController");
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

module.exports = router;
