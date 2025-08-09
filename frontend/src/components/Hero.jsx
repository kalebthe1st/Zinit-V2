// --- START OF FILE Hero.jsx ---

import React, { useState, useEffect, useContext, useMemo } from "react";

import { ShopContext } from "../context/ShopContext";

const Hero = () => {
  // 1. Get products from context
  const { products } = useContext(ShopContext);

  // 2. Create the list of featured products using useMemo for performance
  const featuredProducts = useMemo(() => {
    if (!products) return [];

    const sponsored = products.filter((p) => p.sponsored);
    const discounted = products.filter(
      (p) => p.original_price && p.original_price > p.price
    );
    const bestsellers = products.filter((p) => p.bestseller);

    // Combine and remove duplicates
    const productMap = new Map();
    [...sponsored, ...discounted, ...bestsellers].forEach((p) =>
      productMap.set(p._id, p)
    );

    return Array.from(productMap.values());
  }, [products]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (featuredProducts.length === 0) return;
    const isLastSlide = currentSlide === featuredProducts.length - 1;
    setCurrentSlide(isLastSlide ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    if (featuredProducts.length === 0) return;
    const isFirstSlide = currentSlide === 0;
    setCurrentSlide(
      isFirstSlide ? featuredProducts.length - 1 : currentSlide - 1
    );
  };

  useEffect(() => {
    if (featuredProducts.length > 1) {
      const slider = setInterval(nextSlide, 5000);
      return () => clearInterval(slider);
    }
  }, [currentSlide, featuredProducts.length]);

  // If there are no products to feature, don't render the hero section
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  const activeProduct = featuredProducts[currentSlide];
  console.log("Active product image URL:", activeProduct.image[0]);
  const isDiscounted =
    activeProduct.original_price &&
    activeProduct.original_price > activeProduct.price;

  // Helper to determine the badge/tag for a product
  const getBadge = (product) => {
    if (product.sponsored) return { text: "Sponsored", color: "bg-yellow-500" };
    if (product.original_price > product.price)
      return { text: "On Sale", color: "bg-red-500" };
    if (product.bestseller)
      return { text: "Best Seller", color: "bg-blue-500" };
    return null;
  };

  const badge = getBadge(activeProduct);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="w-full relative flex flex-col md:flex-row bg-gray-50 border rounded-lg shadow-sm overflow-hidden z-10">
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 lg:p-12 text-center md:text-left">
          {badge && (
            <div
              className={`text-xs font-bold text-white ${badge.color} px-3 py-1 rounded-full self-center md:self-start mb-4`}
            >
              {badge.text}
            </div>
          )}

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 prata-regular">
            {activeProduct.name}
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-4 my-4">
            <p className="text-3xl font-bold text-blue-600">
              {activeProduct.price} birr
            </p>
            {isDiscounted && (
              <p className="text-xl text-gray-400 line-through">
                {activeProduct.original_price} birr
              </p>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-6">
            Available now in our {activeProduct.mainCategory} collection. Don't
            miss out!
          </p>

          <button className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors self-center md:self-start">
            Shop Now
          </button>
        </div>

        {/* Right Side: Image and Controls */}
        {/* Right Side: Image and Controls */}
        <div className="w-full md:w-1/2 relative group">
          {/* --- THIS IS THE FIX --- */}
          {/* 1. We've added `aspect-video` (16/9) to the container. */}
          {/*    You can also use `aspect-[2/1]` or `aspect-[3/2]` for different shapes. */}
          {/* 2. We set a `max-h-[500px]` (example value) to prevent it from getting too tall on huge screens. */}
          {/* 3. We ensure it has a background color (`bg-gray-200`) for a smooth image load. */}
          <div className="w-full aspect-video md:aspect-auto md:h-full max-h-[500px] bg-gray-200">
            <img
              src={activeProduct.image[0]}
              alt={activeProduct.name}
              // `w-full h-full object-cover` ensures the image fills the container
              // without being stretched or squished, cropping as needed.
              className="w-full h-full object-cover"
            />
          </div>

          {/* --- The Controls and Dot Indicators are now placed INSIDE the image container --- */}
          {/* This ensures they stay correctly positioned relative to the fixed-size image area. */}

          {/* Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={prevSlide}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand/70 rounded-full p-2 hover:bg-brand"
            >
              {/* ... svg ... */}
            </button>
            <button
              onClick={nextSlide}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand/70 rounded-full p-2 hover:bg-brand"
            >
              {/* ... svg ... */}
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {featuredProducts.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
                  currentSlide === index ? "bg-brand" : "bg-brand/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
