const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { createJWT, attacheCookieResponse } = require("../utils");

const register = async (req, res) => {
	const { email, password, name } = req.body;
	const checkUser = await User.findOne({ email });
	// check if user already exist with same email
	if (checkUser) {
		throw new BadRequestError("user already exists");
	}
	const user = await User.create({ email, password, name });
	const tokenPayload = { name: user.name, userId: user._id, role: user.role };
	attacheCookieResponse({ res, tokenPayload });
	res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("please provide all details");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new NotFoundError("no user with such credentials");
	}

	const isPasswordMatched = user.comparePassword(user.password);
	if (!isPasswordMatched) {
		throw new NotFoundError("no user with such credentials");
	}

	const tokenPayload = { name: user.name, userId: user._id, role: user.role };
	attacheCookieResponse({ res, tokenPayload });
	res.status(StatusCodes.OK).json({ user });
};

const logout = async (req, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { register, login, logout };
