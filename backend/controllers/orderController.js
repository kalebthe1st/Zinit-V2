import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";

// Global variables
const currency = "birr";
const deliveryCharge = 50;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- Placing orders using COD Method (SECURED) ---
const placeOrder = async (req, res) => {
  // FIX: Get userId from the property set by the auth middleware
  const userId = req.userId;

  try {
    const { items, amount, address } = req.body;

    // Ensure each item in the order has a persistent productId
    const processedItems = items.map((item) => ({
      ...item,
      productId: item._id,
    }));

    const orderData = {
      userId: userId, // Use the secure ID
      items: processedItems,
      address: address,
      amount: amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while placing order." });
  }
};

// --- Placing orders using Stripe Method (SECURED) ---
const placeOrderStripe = async (req, res) => {
  // FIX: Get userId from the property set by the auth middleware
  const userId = req.userId;

  try {
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const processedItems = items.map((item) => ({
      ...item,
      productId: item._id,
    }));

    const orderData = {
      userId: userId, // Use the secure ID
      items: processedItems,
      address: address,
      amount: amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrderStripe:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while processing Stripe payment.",
      });
  }
};

// --- Placing orders using Razorpay Method (SECURED) ---
const placeOrderRazorpay = async (req, res) => {
  // FIX: Get userId from the property set by the auth middleware
  const userId = req.userId;

  try {
    const { items, amount, address } = req.body;

    const processedItems = items.map((item) => ({
      ...item,
      productId: item._id,
    }));

    const orderData = {
      userId: userId, // Use the secure ID
      items: processedItems,
      address: address,
      amount: amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay order creation error:", error);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to create Razorpay order.",
          });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.error("Error in placeOrderRazorpay:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while processing Razorpay payment.",
      });
  }
};

// --- Verify Stripe (SECURED) ---
const verifyStripe = async (req, res) => {
  // FIX: Get userId from the property set by the auth middleware
  const userId = req.userId;
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error in verifyStripe:", error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying Stripe payment." });
  }
};

// --- Verify Razorpay (SECURED) ---
const verifyRazorpay = async (req, res) => {
  // FIX: Get userId from the property set by the auth middleware
  const userId = req.userId;
  const { razorpay_order_id } = req.body;

  try {
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error("Error in verifyRazorpay:", error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying Razorpay payment." });
  }
};

// --- All Orders data for Admin Panel (Unchanged) ---
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in allOrders:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all orders." });
  }
};

// --- User's Own Order Data For Frontend (SECURED) ---
const userOrders = async (req, res) => {
  // FIX: Get userId from the property set by the auth middleware
  const userId = req.userId;
  try {
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed." });
    }
    const orders = await orderModel.find({ userId: userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user orders." });
  }
};

// --- Fetch orders for products uploaded by a seller (SECURED) ---
const sellerOrders = async (req, res) => {
  // FIX: Get seller's ID from the property set by the sellerAuth middleware
  const sellerId = req.userId;
  try {
    const sellerProducts = await productModel.find({ sellerId: sellerId });
    if (sellerProducts.length === 0) {
      return res.json({ success: true, orders: [] });
    }
    const sellerProductIds = sellerProducts.map((product) =>
      product._id.toString()
    );
    const ordersContainingSellerItems = await orderModel.find({
      "items.productId": { $in: sellerProductIds },
    });
    const relevantOrders = ordersContainingSellerItems.map((order) => {
      const sellerItemsInOrder = order.items.filter((item) =>
        sellerProductIds.includes(item.productId.toString())
      );
      return {
        _id: order._id,
        buyerUserId: order.userId,
        address: order.address,
        date: order.date,
        status: order.status,
        items: sellerItemsInOrder,
        amount: sellerItemsInOrder.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    });
    res.json({ success: true, orders: relevantOrders });
  } catch (error) {
    console.error("Error in sellerOrders:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching seller orders." });
  }
};

// --- Update order status from Admin Panel (Unchanged) ---
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({ success: false, message: "Error updating status." });
  }
};

export {
  verifyRazorpay,
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  sellerOrders,
  updateStatus,
};
