// --- START OF FILE components/MainCategory.jsx ---

import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext"; // Import the context

const MainCategory = () => {

  // Get the state and setter from the context
  const { mainCategory, setMainCategory } = useContext(ShopContext);

  const categoryData = [
    {
      name: "Traditional",
      image: assets.tradiotional,
      color: "bg-orange-500",
    },
    {
      name: "Occasion",
      image: assets.ocassional, // Ensure this asset exists in your assets file
      color: "bg-teal-500",
    },
    {
      name: "Modern",
      image:
      assets.modern, // Ensure this asset exists in your assets file
      color: "bg-purple-500",
    },
    {
      name: "Bonda",
      image: assets.bonda, // You might want a different image for Bonda
      color: "bg-green-500",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    // If the clicked category is already active, reset to "All". Otherwise, set the new category.
    setMainCategory(prev => prev === categoryName ? "All" : categoryName);
  };

  return (
    <div className="bg-gray-50 h-13 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our Cloth Collection
        </h2>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {categoryData.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleCategoryClick(item.name)}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circular Card with active indicator */}
              <div
                className={`relative w-8 h-8 sm:w-16 sm:h-16 md:w-32 md:h-32 lg:w-48 lg:h-48 ${item.color} rounded-full shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 ${mainCategory === item.name ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-4 md:right-4 w-2 h-2 sm:w-4 sm:h-4 md:w-8 md:h-8 lg:w-16 lg:h-16 bg-white rounded-full"></div>
                  <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 md:bottom-6 md:left-6 w-1.5 h-1.5 sm:w-3 sm:h-3 md:w-6 md:h-6 lg:w-12 lg:h-12 bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-0.5 sm:left-1 md:left-2 w-1 h-1 sm:w-2 sm:h-2 md:w-4 md:h-4 lg:w-8 lg:h-8 bg-white rounded-full"></div>
                </div>
                {/* Image */}
                <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2 md:p-4 lg:p-6">
                  <img
                    className="w-4 h-4 sm:w-8 sm:h-8 md:w-16 md:h-16 lg:w-24 lg:h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
              </div>

              {/* Product Info Below Circle */}
              <div className="mt-1 sm:mt-2 md:mt-4 lg:mt-6 text-center max-w-xs">
                <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-800 mb-1 sm:mb-1 md:mb-2">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainCategory;