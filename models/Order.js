const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const singleOrderItemSchema = new Schema({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
});

const OrderSchema = new Schema(
	{
		tax: {
			type: Number,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		subTotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		orderItems: [singleOrderItemSchema],
		status: {
			type: String,
			enum: ["paid", "pending", "failed", "cancelled", "delivered"],
			default: "pending",
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		clientSecret: {
			type: String,
			required: true,
		},
		paymentIntentId: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = model("Order", OrderSchema);
