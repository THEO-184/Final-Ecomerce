const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
	createOrder,
	getAllOrders,
	getSingleOrder,
	updateOrder,
	getCurrentUserOrders,
} = require("../controller/orderController");

const {
	authMiddleware,
	authorizePermissions,
} = require("../middleware/authentication");

router
	.route("/")
	.post(authMiddleware, createOrder)
	.get(authMiddleware, authorizePermissions("admin"), getAllOrders);

router.route("/my-orders").get(authMiddleware, getCurrentUserOrders);
router
	.route("/:id")
	.get(authMiddleware, getSingleOrder)
	.patch(authMiddleware, updateOrder);

module.exports = router;
