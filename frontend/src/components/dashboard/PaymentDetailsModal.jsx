import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/assets"; // Assuming your assets are exported from here

const PaymentDetailsModal = ({ onComplete }) => {
  const { token, backendUrl, fetchUserProfile } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    telebirrPhone: "",
    cbeAccount: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        formData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success("Payment details saved!");
        await fetchUserProfile(token); // Refresh the user profile in the context
        onComplete(); // Call the callback to close the modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Add Your Payment Details</h2>
        <p className="text-sm text-gray-500 mb-6">
          You need to provide your payment info before you can add products.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Telebirr Input */}
          <div className="relative">
            <img
              src={assets.telebirr}
              alt="Telebirr"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6"
            />
            <input
              type="tel"
              name="telebirrPhone"
              value={formData.telebirrPhone}
              onChange={onChangeHandler}
              placeholder="Telebirr Phone Number"
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* CBE Account Input */}
          <div className="relative">
            <img
              src={assets.cbe}
              alt="CBE"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6"
            />
            <input
              type="text"
              name="cbeAccount"
              value={formData.cbeAccount}
              onChange={onChangeHandler}
              placeholder="CBE Account Number"
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isLoading ? "Saving..." : "Save and Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
