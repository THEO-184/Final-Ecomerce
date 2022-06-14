const express = require("express");
const router = express.Router();

const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require("../controller/userController");

router.route("/").get(getAllUsers);
router
	.route("/:id")
	.get(getSingleUser)
	.get(showCurrentUser)
	.put(updateUser)
	.put(updateUserPassword);

module.exports = router;
