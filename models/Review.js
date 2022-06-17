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

ReviewSchema.statics.calculateAvgRating = async function (productId) {
	console.log(productId);
};

// user can make only one review on a product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// calculate new avg rating when user update his review
ReviewSchema.post("save", async function () {
	await this.constructor.calculateAvgRating(this.product);
});

// calculate new avg rating when user delete review
ReviewSchema.post("remove", async function () {
	await this.constructor.calculateAvgRating(this.product);
});

module.exports = model("Review", ReviewSchema);
