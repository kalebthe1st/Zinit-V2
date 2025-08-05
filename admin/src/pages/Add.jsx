import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [department, setDepartment] = useState("Clothing"); // Default value
  const [mainCategory, setMainCategory] = useState("Modern"); // Default value
  const [color, setColor] = useState("");
  const [purchaseOptions, setPurchaseOptions] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("department", department);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("mainCategory", mainCategory);
      formData.append("color", color);
      formData.append("bestseller", bestseller);

      // Stringify arrays before sending
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("purchaseOptions", JSON.stringify(purchaseOptions));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset all fields
        setName("");
        setDescription("");
        setPrice("");
        setColor("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setSizes([]);
        setPurchaseOptions([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-5 p-4 box-border"
    >
      {/* Image upload section (unchanged) */}
      <div>
        <p className="mb-2 font-semibold">Upload Images (up to 4)</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20 cursor-pointer"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20 cursor-pointer"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20 cursor-pointer"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20 cursor-pointer"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      {/* Product name & description (unchanged) */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2 font-semibold">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border"
          rows={4}
          placeholder="Write content here"
          required
        />
      </div>

      {/* --- ADDED INPUTS for new fields --- */}
      <div className="flex flex-col sm:flex-row gap-5 w-full">
        <div>
          <p className="mb-2 font-semibold">Department</p>
          <select
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            className="px-3 py-2 border"
          >
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2 font-semibold">Main Category</p>
          <input
            onChange={(e) => setMainCategory(e.target.value)}
            value={mainCategory}
            className="px-3 py-2 border"
            type="text"
            placeholder="e.g., Modern"
          />
        </div>
        <div>
          <p className="mb-2 font-semibold">Color</p>
          <input
            onChange={(e) => setColor(e.target.value)}
            value={color}
            className="w-[120px] px-3 py-2 border"
            type="text"
            placeholder="e.g., Red"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 w-full">
        {/* Category, Sub-Category, and Price (unchanged structure) */}
        <div>
          <p className="mb-2 font-semibold">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="px-3 py-2 border"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2 font-semibold">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="px-3 py-2 border"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2 font-semibold">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-[120px] px-3 py-2 border"
            type="Number"
            placeholder="$25"
            required
          />
        </div>
      </div>

      {/* Sizes Section (unchanged) */}
      <div>
        <p className="mb-2 font-semibold">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size, index) => (
            <div
              key={index}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size)
                    ? "bg-green-500 text-white"
                    : "bg-slate-200"
                } px-3 py-1 cursor-pointer rounded`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- ADDED Purchase Options Section --- */}
      <div>
        <p className="mb-2 font-semibold">Purchase Options</p>
        <div className="flex gap-3">
          {["Buy", "Rent"].map((option, index) => (
            <div
              key={index}
              onClick={() =>
                setPurchaseOptions((prev) =>
                  prev.includes(option)
                    ? prev.filter((item) => item !== option)
                    : [...prev, option]
                )
              }
            >
              <p
                className={`${
                  purchaseOptions.includes(option)
                    ? "bg-pink-500 text-white"
                    : "bg-slate-200"
                } px-3 py-1 cursor-pointer rounded`}
              >
                {option}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox (unchanged) */}
      <div className="flex items-center gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="w-4 h-4"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        className="w-32 py-3 mt-4 bg-black text-white rounded"
      >
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;
