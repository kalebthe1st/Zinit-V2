import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

// Get all items a user is eligible to review
const getProductsToReview = async (req, res) => {
  try {
    const userId = req.userId;
    const deliveredOrders = await orderModel.find({
      userId: userId,
      status: "Delivered",
    });
    const itemsToReview = deliveredOrders.flatMap((order) =>
      order.items.filter((item) => item.reviewToken)
    );
    res.json({ success: true, itemsToReview });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching products to review." });
  }
};

// Submit a new review using a token
const submitReview = async (req, res) => {
  try {
    const { rating, comment, reviewToken } = req.body;
    const userId = req.userId;
    const order = await orderModel.findOne({
      "items.reviewToken": reviewToken,
    });

    if (!order || order.userId.toString() !== userId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid review token." });
    }

    const itemToReview = order.items.find(
      (item) => item.reviewToken === reviewToken
    );
    const product = await productModel.findById(itemToReview.productId);

    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === userId
    );
    if (alreadyReviewed) {
      // To prevent multiple reviews on the same product from different orders,
      // you can remove this check if you want to allow it.
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already reviewed this product.",
        });
    }

    const review = {
      user: userId,
      name: req.userName,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    await orderModel.updateOne(
      { _id: order._id, "items.reviewToken": reviewToken },
      { $set: { "items.$.reviewToken": null } }
    );
    res.json({ success: true, message: "Thank you for your review!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error submitting review." });
  }
};

export { submitReview, getProductsToReview };
