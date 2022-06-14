const express = require("express");
const router = express.Router();
const {
	authMiddleware,
	authorizePermissions,
} = require("../middleware/authentication");
const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require("../controller/userController");

router
	.route("/")
	.get(authMiddleware, authorizePermissions("admin"), getAllUsers);
router.route("/showMe").get(authMiddleware, showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updatePassword").patch(updateUserPassword);
router.route("/:id").get(authMiddleware, getSingleUser);

module.exports = router;
