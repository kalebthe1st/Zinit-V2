import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../context/ShopContext";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { isSeller } = useContext(ShopContext);
  const activeStyle = {
    backgroundColor: "#FFF1F2",
    borderColor: "#F43F5E",
    color: "#F43F5E",
    fontWeight: "600",
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* --- OVERLAY (Mobile Only) --- */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* --- SIDEBAR --- */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r-2 p-4 z-40 md:relative md:w-[250px] md:translate-x-0 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center md:hidden mb-4">
          <h3 className="font-bold">Dashboard Menu</h3>
          <button onClick={closeSidebar} className="text-2xl">
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-2 text-gray-700">
          <NavLink
            to="/dashboard/profile"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent"
          >
            <img className="w-5 h-5" src={assets.profile_icon} alt="Profile" />
            <p>My Profile</p>
          </NavLink>
          <NavLink
            to="/dashboard/user-orders"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent"
          >
            <img className="w-5 h-5" src={assets.order_icon} alt="Orders" />
            <p>{isSeller ? "Orders for My Products" : "My Orders"}</p>
          </NavLink>

          {!isSeller && (
            <NavLink
              to="/dashboard/reviews"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent"
            >
              <img className="w-5 h-5" src={assets.add_icon} alt="Reviews" />
              <p>Products to Review</p>
            </NavLink>
          )}

          {isSeller && (
            <>
              <hr className="my-3" />
              <p className="px-4 pt-2 pb-1 text-sm font-bold text-gray-400 uppercase">
                Seller Tools
              </p>
              <NavLink
                to="/dashboard/add-product"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent"
              >
                <img
                  className="w-5 h-5"
                  src={assets.add_icon}
                  alt="Add Product"
                />
                <p>Add Product</p>
              </NavLink>
              <NavLink
                to="/dashboard/my-products"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent"
              >
                <img
                  className="w-5 h-5"
                  src={assets.order_icon}
                  alt="My Products"
                />
                <p>My Products</p>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default DashboardSidebar;
