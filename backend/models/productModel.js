import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  original_price: { type: Number }, // <-- ADD THIS LINE
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true }, // Defines an array of strings
  department: { type: String, required: true }, // Added from your example
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  mainCategory: { type: String }, // Added from your example
  color: { type: String }, // Added from your example
  sizes: { type: [String], required: true }, // Defines an array of strings
  bestseller: { type: Boolean, default: false },
  purchaseOptions: { type: [String] }, // Added from your example
  date: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 }, // The calculated average rating
  numReviews: { type: Number, default: 0 }, // The total number of reviews
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ], // Changed to Date type with a default value
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
