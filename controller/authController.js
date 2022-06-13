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
	res.send("login");
};

const logout = async (req, res) => {
	res.send("logout");
};

module.exports = { register, login, logout };
