const { ProductReview } = require("../models");

const isReviewOwner = async (req, res, next) => {
  try {
    const review = await ProductReview.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review không tồn tại",
      });
    }

    // Nếu user không phải chủ review → chặn
    if (review.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền sửa hoặc xóa review này",
      });
    }

    next();
  } catch (error) {
    console.error("isReviewOwner error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kiểm tra quyền sở hữu review",
    });
  }
};

module.exports = isReviewOwner;
