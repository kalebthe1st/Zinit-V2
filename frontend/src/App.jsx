import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDashboardLayout from "./layouts/UserDashboardLayout";
import MyOrders from "./pages/dashboard/MyOrders";
import Profile from "./pages/dashboard/Profile";
import UserAddProduct from "./pages/dashboard/UserAddProduct";
import MyProducts from "./pages/dashboard/MyProducts";
import EditProduct from "./pages/dashboard/EditProduct"; // <-- Import the new page component
import VerifyEmail from "./pages/VerifyEmail";
import ProductsToReview from "./pages/dashboard/ProductsToReview";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />

        {/* <-- ADD THIS */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<UserDashboardLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="user-orders" element={<MyOrders />} />
          <Route path="add-product" element={<UserAddProduct />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="edit-product/:productId" element={<EditProduct />} />
          <Route path="reviews" element={<ProductsToReview />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
