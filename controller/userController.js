const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { NotFoundError, BadRequestError } = require("../errors");

const User = require("../models/User");

const getAllUsers = async (req, res) => {
	console.log("req", req.user);
	const users = await User.find({ role: "user" }).select("-password -__v");
	res
		.status(StatusCodes.OK)
		.json({ success: true, total: users.length, users });
};

const getSingleUser = async (req, res) => {
	const { id } = req.params;
	const user = await User.findOne({ _id: id }).select("-password -__v");
	if (!user) {
		throw new NotFoundError(`No user with id ${id} found`);
	}
	res.status(StatusCodes.OK).json({ success: true, user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
	res.send("update user");
};

const updateUserPassword = async (req, res) => {
	const { old_password, new_password } = req.body;
	if (!old_password || !new_password) {
		throw new BadRequestError("please privde all details");
	}
	const user = await User.findOne({ _id: req.user.userId });

	const isPasswordMatch = await user.comparePassword(old_password);
	if (!isPasswordMatch) {
		throw new NotFoundError("please check your password credentials well");
	}

	const hashedPassword = await bcrypt.hash(new_password, 10);

	user.password = new_password;
	await user.save();

	res.status(StatusCodes.OK).json({ success: true, msg: "update successful" });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
};
