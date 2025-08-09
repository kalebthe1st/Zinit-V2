import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import PaymentDetailsModal from "../../components/dashboard/PaymentDetailsModal";

// --- Define constant data for our select options ---
const MAIN_CATEGORIES = ["Traditional", "Occasion", "Bonda", "Modern"];
const COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Orange", hex: "#f97316" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Gray", hex: "#6b7280" },
  { name: "Brown", hex: "#78350f" },
];
const SUB_CATEGORIES = {
  Clothing: ["Topwear", "Bottomwear", "Complete", "Dress", "Family"],
  Shoes: ["Flats", "Heels", "Sandals", "Sneakers", "Boots"],
  Accessories: ["Bags", "Jewelry", "Hats"],
};

const UserAddProduct = () => {
  const { token, backendUrl, userProfile } = useContext(ShopContext);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // --- State Management ---
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    department: "Clothing",
    category: "Men",
    subCategory: "Topwear",
    mainCategory: "Traditional",
    color: "Red",
    sizes: [],
    purchaseOptions: [],
  });

  // --- Hooks ---
  useEffect(() => {
    if (userProfile && userProfile.isSeller) {
      if (!userProfile.telebirrPhone || !userProfile.cbeAccount) {
        setShowPaymentModal(true);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    const newSubCategories = SUB_CATEGORIES[formData.department] || [];
    setFormData((prev) => ({
      ...prev,
      subCategory: newSubCategories[0] || "",
    }));
  }, [formData.department]);

  // --- Handlers ---
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const productFormData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      productFormData.append(
        key,
        Array.isArray(value) ? JSON.stringify(value) : value
      );
    });

    if (image1) productFormData.append("image1", image1);
    if (image2) productFormData.append("image2", image2);
    if (image3) productFormData.append("image3", image3);
    if (image4) productFormData.append("image4", image4);

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/user/add`,
        productFormData,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Product added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          department: "Clothing",
          category: "Men",
          subCategory: "Topwear",
          mainCategory: "Traditional",
          color: "Red",
          sizes: [],
          purchaseOptions: [],
        });
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding the product.");
    }
  };

  if (!userProfile) return <p>Loading user data...</p>;

  return (
    <div>
      {showPaymentModal && (
        <PaymentDetailsModal onComplete={() => setShowPaymentModal(false)} />
      )}
      <h2 className="text-2xl font-bold mb-6">Add a New Product</h2>
      <div className={showPaymentModal ? "opacity-20 pointer-events-none" : ""}>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col w-full items-start gap-5 p-4 box-border border rounded-lg bg-white shadow-sm"
        >
          <div>
            <p className="font-medium mb-2">
              Upload Images (Main image first, up to 4)
            </p>
            <div className="flex gap-2">
              <label htmlFor="image1">
                <img
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  src={
                    image1 ? URL.createObjectURL(image1) : assets.upload_area
                  }
                  alt="Upload slot 1"
                />
                <input
                  onChange={(e) => setImage1(e.target.files[0])}
                  type="file"
                  id="image1"
                  hidden
                  accept="image/*"
                />
              </label>
              <label htmlFor="image2">
                <img
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  src={
                    image2 ? URL.createObjectURL(image2) : assets.upload_area
                  }
                  alt="Upload slot 2"
                />
                <input
                  onChange={(e) => setImage2(e.target.files[0])}
                  type="file"
                  id="image2"
                  hidden
                  accept="image/*"
                />
              </label>
              <label htmlFor="image3">
                <img
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  src={
                    image3 ? URL.createObjectURL(image3) : assets.upload_area
                  }
                  alt="Upload slot 3"
                />
                <input
                  onChange={(e) => setImage3(e.target.files[0])}
                  type="file"
                  id="image3"
                  hidden
                  accept="image/*"
                />
              </label>
              <label htmlFor="image4">
                <img
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  src={
                    image4 ? URL.createObjectURL(image4) : assets.upload_area
                  }
                  alt="Upload slot 4"
                />
                <input
                  onChange={(e) => setImage4(e.target.files[0])}
                  type="file"
                  id="image4"
                  hidden
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="font-medium">Product Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChangeHandler}
              type="text"
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="font-medium">Product Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChangeHandler}
              className="w-full mt-1 p-2 border rounded"
              rows="4"
              required
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-medium">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={onChangeHandler}
                className="w-full mt-1 p-2 border rounded bg-white"
              >
                {Object.keys(SUB_CATEGORIES).map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">Sub Category</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={onChangeHandler}
                className="w-full mt-1 p-2 border rounded bg-white"
                disabled={!formData.department}
              >
                {(SUB_CATEGORIES[formData.department] || []).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">Main Category</label>
              <select
                name="mainCategory"
                value={formData.mainCategory}
                onChange={onChangeHandler}
                className="w-full mt-1 p-2 border rounded bg-white"
              >
                {MAIN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">Color</label>
              <div className="flex items-center gap-3 mt-1">
                <select
                  name="color"
                  value={formData.color}
                  onChange={onChangeHandler}
                  className="w-full p-2 border rounded bg-white"
                >
                  {COLORS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div
                  className="w-8 h-8 rounded-full border flex-shrink-0"
                  style={{
                    backgroundColor:
                      COLORS.find((c) => c.name === formData.color)?.hex ||
                      "#ffffff",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <label className="font-medium">Price (in Birr)</label>
              <input
                name="price"
                value={formData.price}
                onChange={onChangeHandler}
                type="number"
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Available Sizes</p>
            <div className="flex gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 border rounded cursor-pointer ${
                    formData.sizes.includes(size)
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-32 py-3 mt-4 bg-black text-white rounded hover:bg-gray-800"
          >
            ADD PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAddProduct;
