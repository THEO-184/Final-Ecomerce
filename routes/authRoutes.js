const express = require("express");
const router = express.Router();

const {
	login,
	register,
	logout,
	forgotPassword,
	resetPassword,
} = require("../controller/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
