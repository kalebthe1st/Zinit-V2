import React, { useContext, useEffect, useState, useMemo } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import MainCategory from "../components/MainCategory";
import Rating from "../components/Rating"; // Import Rating for filter UI

const Collection = () => {
  const {
    products, search, showSearch, mainCategory,
    department, setDepartment,
    category, setCategory,
    subCategory, setSubCategory,
    purchaseType, setPurchaseType,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    selectedColors, setSelectedColors,
    sortType, setSortType,
    ratingFilter, setRatingFilter, // Get rating state from context
    clearFilters
  } = useContext(ShopContext);

  const [filterProducts, setFilterProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const toggleDepartment = (e) => setDepartment(prev => prev.includes(e.target.value) ? prev.filter(d => d !== e.target.value) : [...prev, e.target.value]);
  const toggleCategory = (e) => setCategory(prev => prev.includes(e.target.value) ? prev.filter(c => c !== e.target.value) : [...prev, e.target.value]);
  const toggleSubCategory = (e) => setSubCategory(prev => prev.includes(e.target.value) ? prev.filter(s => s !== e.target.value) : [...prev, e.target.value]);
  const toggleColor = (e) => setSelectedColors(prev => prev.includes(e.target.value) ? prev.filter(c => c !== e.target.value) : [...prev, e.target.value]);
  const handlePurchaseTypeChange = (e) => setPurchaseType(e.target.value);

  const availableColors = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map(p => p.color).filter(Boolean))];
  }, [products]);

  useEffect(() => {
    let productsCopy = products ? [...products] : [];
    if (mainCategory !== "All") productsCopy = productsCopy.filter(item => item.mainCategory === mainCategory);
    if (showSearch && search) productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    if (department.length > 0) productsCopy = productsCopy.filter(item => department.includes(item.department));
    if (category.length > 0) productsCopy = productsCopy.filter(item => category.includes(item.category));
    if (subCategory.length > 0) productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    if (selectedColors.length > 0) productsCopy = productsCopy.filter(item => selectedColors.includes(item.color));
    if (purchaseType) productsCopy = productsCopy.filter(item => item.purchaseOptions.includes(purchaseType));
    if (minPrice && !isNaN(minPrice)) productsCopy = productsCopy.filter(item => item.price >= Number(minPrice));
    if (maxPrice && !isNaN(maxPrice)) productsCopy = productsCopy.filter(item => item.price <= Number(maxPrice));
    
    // Add rating filter logic
    if (ratingFilter > 0) {
        productsCopy = productsCopy.filter(item => item.rating && item.rating >= ratingFilter);
    }

    if (sortType === 'low-high') productsCopy.sort((a, b) => a.price - b.price);
    if (sortType === 'high-low') productsCopy.sort((a, b) => b.price - a.price);
    
    setFilterProducts(productsCopy);
  }, [products, department, category, subCategory, search, showSearch, mainCategory, purchaseType, minPrice, maxPrice, selectedColors, sortType, ratingFilter]);

  useEffect(() => {
    if (mainCategory !== "Occasion" && mainCategory !== "Traditional") {
        setPurchaseType('');
    }
  }, [mainCategory, setPurchaseType]);

  const showPurchaseOptions = mainCategory === "Occasion" || mainCategory === "Traditional";

  return (
    <>
      <MainCategory />
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        <div className="min-w-60">
          <div className="flex justify-between items-center mb-2">
            <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">FILTERS<img className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} src={assets.dropdown_icon} alt="" /></p>
            <button onClick={clearFilters} className="text-xs font-bold text-blue-600 hover:underline pr-2">Clear All</button>
          </div>
          <div className={`${showFilter ? "" : "hidden"} sm:block`}>
            {showPurchaseOptions && (
              <div className="border border-gray-300 pl-5 py-3 mt-6">
                <p className="mb-3 text-sm font-medium">PURCHASE OPTION</p>
                <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                    <p className="flex gap-2"><input className="w-3" type="radio" value="" name="purchaseType" onChange={handlePurchaseTypeChange} checked={purchaseType === ""} /> All</p>
                    <p className="flex gap-2"><input className="w-3" type="radio" value="Buy" name="purchaseType" onChange={handlePurchaseTypeChange} checked={purchaseType === "Buy"} /> Buy</p>
                    <p className="flex gap-2"><input className="w-3" type="radio" value="Rent" name="purchaseType" onChange={handlePurchaseTypeChange} checked={purchaseType === "Rent"} /> Rent</p>
                </div>
              </div>
            )}
            <div className="border border-gray-300 pl-5 pr-3 py-3 mt-6">
              <p className="mb-3 text-sm font-medium">PRICE RANGE</p>
              <div className="flex items-center gap-2 text-sm font-light text-gray-700">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-0 flex-grow p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <span className="font-medium">-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-0 flex-grow p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
             <div className="border border-gray-300 pl-5 py-3 mt-6">
                <p className="mb-3 text-sm font-medium">RATING</p>
                <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                    {[4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2 cursor-pointer" onClick={() => setRatingFilter(ratingFilter === star ? 0 : star)}>
                            <input type="radio" name="rating" readOnly checked={ratingFilter === star} className="w-3 h-3" />
                            <Rating rating={star} />
                            <span className="text-xs">& up</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border border-gray-300 pl-5 py-3 mt-6">
              <p className="mb-3 text-sm font-medium">COLOR</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {availableColors.map(color => (
                  <p className="flex gap-2" key={color}><input className="w-3" value={color} onChange={toggleColor} type="checkbox" checked={selectedColors.includes(color)} /> {color}</p>
                ))}
              </div>
            </div>
            <div className="border border-gray-300 pl-5 py-3 mt-6">
              <p className="mb-3 text-sm font-medium">DEPARTMENT</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <p className="flex gap-2"><input className="w-3" value="Clothing" onChange={toggleDepartment} type="checkbox" checked={department.includes("Clothing")} /> Clothing</p>
                <p className="flex gap-2"><input className="w-3" value="Shoes" onChange={toggleDepartment} type="checkbox" checked={department.includes("Shoes")} /> Shoes</p>
              </div>
            </div>
            <div className="border border-gray-300 pl-5 py-3 mt-6">
              <p className="mb-3 text-sm font-medium">CATEGORIES</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <p className="flex gap-2"><input className="w-3" value="Men" onChange={toggleCategory} type="checkbox" checked={category.includes("Men")} /> Men</p>
                <p className="flex gap-2"><input className="w-3" value="Women" onChange={toggleCategory} type="checkbox" checked={category.includes("Women")} /> Women</p>
                <p className="flex gap-2"><input className="w-3" value="Kids" onChange={toggleCategory} type="checkbox" checked={category.includes("Kids")} /> Kids</p>
              </div>
            </div>
            <div className="border border-gray-300 pl-5 py-3 my-5">
              <p className="mb-3 text-sm font-medium">TYPE</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <p className="flex gap-2"><input className="w-3" value="Topwear" onChange={toggleSubCategory} type="checkbox" checked={subCategory.includes("Topwear")} /> Topwear</p>
                <p className="flex gap-2"><input className="w-3" value="Bottomwear" onChange={toggleSubCategory} type="checkbox" checked={subCategory.includes("Bottomwear")} /> Bottomwear</p>
                <p className="flex gap-2"><input className="w-3" value="Winterwear" onChange={toggleSubCategory} type="checkbox" checked={subCategory.includes("Winterwear")} /> Winterwear</p>
                <p className="flex gap-2"><input className="w-3" value="Sneakers" onChange={toggleSubCategory} type="checkbox" checked={subCategory.includes("Sneakers")} /> Sneakers</p>
                <p className="flex gap-2"><input className="w-3" value="Boots" onChange={toggleSubCategory} type="checkbox" checked={subCategory.includes("Boots")} /> Boots</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={"ALL"} text2={"COLLECTIONS"} />
            <select onChange={(e) => setSortType(e.target.value)} value={sortType} className="border-2 border-gray-300 text-sm px-2">
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.length > 0 ? (
                filterProducts.map((item) => (
                    <ProductItem key={item._id} product={item} />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 py-10">No products match your current filters.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;