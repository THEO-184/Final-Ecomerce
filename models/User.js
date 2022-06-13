const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, "please provide user name"],
		minLength: 3,
		maxLength: 50,
	},
	email: {
		type: String,
		required: [true, "please provide user email"],
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: "please provide valide email",
		},
	},
	password: {
		type: String,
		required: [true, "please provide user password"],
		minLength: 6,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
});

UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		console.log(err);
	}
});

UserSchema.methods.comparePassword = async function (password) {
	const isMatched = await bcrypt.compare(password, this.password);
	return isMatched;
};

UserSchema.methods.createJWT = async function () {
	return jwt.sign(
		{ name: this.name, userRole: this.role, userId: this._id },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		}
	);
};

module.exports = model("User", UserSchema);
