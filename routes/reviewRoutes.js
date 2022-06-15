const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authentication");

const {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
} = require("../controller/reviewController");

router.route("/").post(authMiddleware, createReview).get(getAllReviews);
router
	.route("/:id")
	.get(getSingleReview)
	.patch(authMiddleware, updateReview)
	.delete(authMiddleware, deleteReview);

module.exports = router;
