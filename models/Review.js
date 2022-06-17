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

// get access to all reveiew collections and calculate average rating

ReviewSchema.statics.calculateAvgRating = async function (productId) {
	const result = await this.aggregate([
		{ $match: { product: productId } },

		{ $project: { _id: 0, rating: 1 } },
		{
			$group: {
				_id: null,
				averageRating: { $avg: "$rating" },
				numOfReviews: { $sum: 1 },
			},
		},
	]);
	await this.model("Product").findOneAndUpdate(
		{ _id: productId },
		{
			averageRating: result[0]?.averageRating || 0,
			numOfReviews: result[0]?.numOfReviews || 0,
		}
	);
};

ReviewSchema.post("save", async function () {
	await this.constructor.calculateAvgRating(this.product);
});

ReviewSchema.post("remove", async function () {
	await this.constructor.calculateAvgRating(this.product);
});

module.exports = model("Review", ReviewSchema);
