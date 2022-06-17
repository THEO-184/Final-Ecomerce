const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const fs = require("fs");
const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");

const createOrder = async (req, res) => {
	res.send("create order");
};

const getAllOrders = async (req, res) => {
	res.send(" getAll order");
};

const getCurrentUserOrders = async (req, res) => {
	res.send("getCurrentUser order");
};

const getSingleOrder = async (req, res) => {
	res.send("getSingle order");
};

const updateOrder = async (req, res) => {
	res.send("update order");
};

module.exports = {
	createOrder,
	getAllOrders,
	getSingleOrder,
	updateOrder,
	getCurrentUserOrders,
};
