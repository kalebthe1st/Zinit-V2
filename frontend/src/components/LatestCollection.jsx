// --- START OF FILE LatestCollection.jsx ---

import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem"; // Ensure this is imported

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const { products } = useContext(ShopContext);

  useEffect(() => {
    if (products && products.length > 0) {
      // Sort by date to get the truly latest items, then slice
      const sortedProducts = [...products].sort((a, b) => b.date - a.date);
      setLatestProducts(sortedProducts.slice(0, 10));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover the newest trends and styles, freshly added to our store.
        </p>
      </div>

      <div className="masonry-grid">
        {latestProducts.map((item) => (
          // --- THIS IS THE FIX ---
          // Pass the entire 'item' object as the 'product' prop
          <ProductItem key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
