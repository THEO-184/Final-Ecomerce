const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");

const createProduct = async (req, res) => {
	req.body.user = req.user.userId;
	const product = await Product.create(req.body);
	res.status(StatusCodes.CREATED).json({ success: true, product });
};

const getAllProducts = async (req, res) => {
	const products = await Product.find({});
	res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSingleProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOne({ _id: productId });
	if (!product) {
		throw new NotFoundError(`product with id ${productId} not found`);
	}
	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
		new: true,
		runValidators: true,
	});
	if (!product) {
		throw new NotFoundError(`product with id ${productId} not found`);
	}
	res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOne({ _id: productId });
	if (!product) {
		throw new NotFoundError(`product with id ${productId} not found`);
	}

	await product.remove();
	res
		.status(StatusCodes.OK)
		.json({ msg: `product with id ${productId} successfully deleted` });
};

const uploadImage = async (req, res) => {
	const productImage = req.files.image;
	if (!req.files) {
		throw new BadRequestError("upload file");
	}

	if (!productImage.mimetype.startsWith("image")) {
		throw new BadRequestError("file must be image type");
	}
	const productItem = await cloudinary.uploader.upload(
		productImage.tempFilePath,
		{
			use_filename: true,
			folder: "ecommerce",
		}
	);
	fs.unlinkSync(productImage.tempFilePath);
	console.log(productImage);
	res.status().json({ image: productItem });
};

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
};
