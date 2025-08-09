import express from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  addProductByUser,
  listProductsByUser,
  getProductsByUserIdForAdmin,
  updateProductByUser,
  deleteProductByUser,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import sellerAuth from "../middleware/sellerAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);
productRouter.put("/user/update/:productId", sellerAuth, updateProductByUser);
productRouter.delete(
  "/user/delete/:productId",
  sellerAuth,
  deleteProductByUser
);
productRouter.post(
  "/user/add",
  sellerAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProductByUser
);
productRouter.get("/user/list", sellerAuth, listProductsByUser);
productRouter.get(
  "/list-by-user/:userId",
  adminAuth,
  getProductsByUserIdForAdmin
);
export default productRouter;
