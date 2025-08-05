import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      department,
      category,
      subCategory,
      mainCategory,
      color,
      sizes,
      bestseller,
      purchaseOptions,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      image: imagesUrl,
      department,
      category,
      subCategory,
      mainCategory,
      color,
      // Assuming 'sizes' and 'purchaseOptions' are sent as JSON strings from the client
      sizes: JSON.parse(sizes),
      purchaseOptions: JSON.parse(purchaseOptions),
      bestseller: bestseller === "true",
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const addProductByUser = async (req, res) => {
  try {
    // All form data from req.body

    const {
      name,
      description,
      price,
      department,
      category,
      subCategory,
      mainCategory,
      color,
      sizes,
      bestseller,
      purchaseOptions,
    } = req.body;

    // Image handling from req.files (same as your admin addProduct)
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    const productData = {
      name,
      description,
      price: Number(price),
      image: imagesUrl,
      department,
      category,
      subCategory,
      mainCategory,
      color,
      // Assuming 'sizes' and 'purchaseOptions' are sent as JSON strings from the client
      sizes: JSON.parse(sizes),
      purchaseOptions: JSON.parse(purchaseOptions),
      bestseller: bestseller === "true",
      sellerId: req.userId,
    };

    if (!productData.sellerId) {
      console.error(
        "Controller Error: sellerId is missing after middleware. This should not happen."
      );
      return res
        .status(500)
        .json({
          success: false,
          message: "A server authentication error occurred.",
        });
    }

    console.log(
      "Controller: Attempting to save product with data:",
      productData
    );

    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: "Product Added by User" });
  } catch (error) {
     console.error("!!! Controller Error in addProductByUser !!!");
        console.error(error); // Log the full Mongoose validation error
        res.status(500).json({ success: false, message: "Server error: Could not add product." })
  }
};

// Function for a seller to list their own products
const listProductsByUser = async (req, res) => {
    console.log("--- Controller: listProductsByUser reached ---");

    // --- The MOST LIKELY source of error is here ---
    // We are getting the userId from `req.userId`, which is set by the sellerAuth middleware.
    const sellerIdFromToken = req.userId;

    console.log("Controller: Attempting to find products for sellerId:", sellerIdFromToken);

    // Defensive check
    if (!sellerIdFromToken) {
        console.error("Controller Error: No sellerId was found on the request object after middleware.");
        return res.status(401).json({ success: false, message: "Authentication error: User ID not found." });
    }

    try {
        // The database query using the secure ID from the token
        const products = await productModel.find({ sellerId: sellerIdFromToken });

        console.log(`Controller: Database query complete. Found ${products.length} product(s).`);
        
        res.json({ success: true, products: products });

    } catch (error) {
        console.error("!!! Controller Error during database query in listProductsByUser !!!");
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while fetching your products." });
    }
};
// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  addProductByUser,
  listProductsByUser,
};
