const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ProductSchema = new Schema(
	{
		name: {
			type: String,
			trim: 10,
			minlength: [3, "must be atleast three characters"],
			maxlength: 30,
			required: [true, "provide product name"],
		},
		price: {
			type: Number,
			default: 0,
			required: [true, "provide product price"],
		},
		description: {
			type: String,
			minlength: [3, "must be atleast three characters"],
			required: [true, "provide product description"],
		},
		image: {
			type: String,
			default: "/uploads/example.jpeg",
		},
		category: {
			type: String,
			enum: ["office", "kitchen", "bedroom"],
			required: [true, "provide product category"],
		},
		company: {
			type: String,
			required: [true, "provide product company"],
			enum: {
				values: ["ikea", "liddy", "marcos"],
				message: "{VALUE} is not supported",
			},
		},
		colors: {
			type: [String],
			default: "#222",
		},
		featured: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: Number,
			default: 15,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("Product", ProductSchema);
