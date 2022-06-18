const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");
const fs = require("fs");
const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = ({ amount, currency }) => {
	const client_secret = "somerandomvalue";
	return { client_secret, amount };
};

const createOrder = async (req, res) => {
	const { tax, shippingFee, items: cartItems } = req.body;
	if (!tax || !shippingFee) {
		throw new BadRequestError("tax and shippingfee must be provided");
	}
	if (!cartItems || !cartItems.length) {
		throw new BadRequestError("provide cart items");
	}

	let orderItems = [];
	let subTotal = 0;
	for (let item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) {
			throw new BadRequestError(
				`No product with id : ${item.product} was found`
			);
		}
		const { image, name, price } = dbProduct;
		const singleProduct = {
			image,
			name,
			price,
			amount: item.amount,
			product: item.product,
		};
		// add items to orders
		orderItems = [...orderItems, singleProduct];
		// calculate sub total
		subTotal += item.amount * price;
	}
	// total cost of order
	const total = tax + shippingFee + subTotal;
	// create stripe payment intent
	const paymentIntent = await fakeStripeAPI({
		amount: total,
		currency: "usd",
	});
	// create order
	const order = await Order.create({
		tax,
		shippingFee,
		subTotal,
		total,
		orderItems,
		user: req.user.userId,
		clientSecret: paymentIntent.client_secret,
	});
	res.status(StatusCodes.OK).json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
	const orders = await Order.find({});
	res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getCurrentUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user.userId });
	if (!orders) {
		throw new BadRequestError(`No order with id : ${req.params.id}`);
	}
	res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
	const order = await Order.findOne({ _id: req.params.id });
	if (!order) {
		throw new BadRequestError(`No order with id : ${req.params.id}`);
	}
	checkPermissions(req.user, order.user);
	res.status(StatusCodes.OK).json({ order });
};

const updateOrder = async (req, res) => {
	const {
		params: { id },
		body: { paymentIntentId },
	} = req;

	const order = await Order.findOne({ _id: id });
	if (!order) {
		throw new BadRequestError(`No order with id : ${req.params.id}`);
	}
	checkPermissions(req.user, order.user);
	order.paymentIntentId = paymentIntentId;
	order.status = "paid";
	await order.save();
	res.status(StatusCodes.OK).json({ msg: "successfully updated" });
};

module.exports = {
	createOrder,
	getAllOrders,
	getSingleOrder,
	updateOrder,
	getCurrentUserOrders,
};
