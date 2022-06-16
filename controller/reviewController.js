const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const Review = require("../models/Review");
const { NotFoundError, BadRequestError } = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
	const { product: productId } = req.body;

	const isValid = await Product.findOne({ _id: productId });
	if (!isValid) {
		throw new NotFoundError(`No product with id ${productId} was found`);
	}
	const isAlreadyReviewed = await Review.findOne({
		user: req.user.userId,
		product: productId,
	});
	if (isAlreadyReviewed) {
		throw new BadRequestError("product already reviewed by same user");
	}
	req.body.user = req.user.userId;
	const review = await Review.create(req.body);
	res.status(StatusCodes.CREATED).json({ success: true, review });
};

const getAllReviews = async (req, res) => {
	const reviews = await Review.find({}).populate({
		path: "product",
		select: "name price category",
	});
	res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
	const review = await Review.findOne({ _id: req.params.id }).populate({
		path: "product",
		select: "name price category",
	});
	if (!review) {
		throw new NotFoundError(`no review with id ${req.params.id}`);
	}
	res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
	const {
		params: { id },
		body: { title, comment, rating },
	} = req;

	const review = await Review.findOne({ _id: id });
	if (!review) {
		throw new NotFoundError(`no review with id ${req.params.id}`);
	}
	review.title = title;
	review.comment = comment;
	review.rating = rating;
	await review.save();
	res
		.status(StatusCodes.OK)
		.json({ msg: `review with id ${id} successfully updated` });
};

const deleteReview = async (req, res) => {
	const review = await Review.findOne({ _id: req.params.id });
	if (!review) {
		throw new NotFoundError(`no review with id ${req.params.id}`);
	}
	checkPermissions(req.user, review.user);
	await review.remove();
	res
		.status(StatusCodes.OK)
		.json({ msg: `review with id ${req.params.id} succesfullydeleted` });
};

const getSingleProductReviews = async (req, res) => {
	const { id: product } = req.params;
	const reviews = await Review.find({ product });
	if (!reviews.length) {
		throw new NotFoundError(
			`no reviews on product with id ${product.toString()}`
		);
	}
	res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	getSingleProductReviews,
};
