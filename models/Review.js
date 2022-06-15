const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ReviewSchema = new Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, "please provide rating value"],
		},
		title: {
			type: String,
			trim: true,
			required: [true, "atmost hundred characters expected"],
			maxlength: 100,
		},
		comment: {
			type: String,
			required: [true, "please provide comment on product"],
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		product: {
			type: mongoose.Types.ObjectId,
			ref: "Product",
			required: true,
		},
	},
	{ timestamps: true }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = model("Review", ReviewSchema);
