const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const isReviewOwner = require("../middleware/isReviewOwner");

const reviewController = require("../controllers/reviewController");
const upload = require("../middleware/uploadMiddleware");

// 🔓 Public API
router.get("/by-id/:id", reviewController.getReviewById);
router.get("/:product_id", reviewController.getReviewsByProductId);

// 🔐 Private API
router.use(authMiddleware);

// Admin xem toàn bộ review
router.get(
  "/admin/all",
  roleMiddleware(["admin"]),
  reviewController.getAllReviews
);

// User xem review của mình
router.get("/user/all", reviewController.getReviewsByUser);

// Tạo review
router.post(
  "/products/:id",
  upload.single("image"),
  reviewController.createReview
);

// ⭐ Sửa review — chỉ chủ review được sửa
router.put("/:id", isReviewOwner, reviewController.updateReview);

// ⭐ Xóa review — chỉ chủ review được xóa
router.delete("/:id", isReviewOwner, reviewController.deleteReview);

// ⭐ Admin confirm review
router.put(
  "/:id/status",
  roleMiddleware(["admin"]),
  reviewController.updateReviewStatus
);

module.exports = router;
