import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Rating from './Rating'; // Import the new Rating component

const ProductItem = ({ product }) => {
  const { currency } = useContext(ShopContext);
  
  // Destructure with default values to prevent crashes if data is missing
  const { 
    _id:id, 
    image, 
    name = "Untitled Product", 
    price = 0, 
    purchaseOptions = [], 
    rating = 0, 
    numReviews = 0 
  } = product || {};

  const imageUrl = image && image[0] ? image[0] : "https://via.placeholder.com/300";

  return (
    <Link to={`/product/${id}`} onClick={() => window.scrollTo(0, 0)} className='text-gray-700 cursor-pointer group flex flex-col'>
      <div className='overflow-hidden rounded-md'>
        <img
          className='hover:scale-110 transition ease-in-out'
          src={imageUrl}
          alt={name}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300"; }}
        />
      </div>

      <div className="flex-grow flex flex-col pt-3 pb-1">
        <p className='text-sm font-semibold text-gray-800 truncate flex-grow'>{name}</p>
        
        {/* Conditional Rating Display */}
        {purchaseOptions.includes('Rent') && rating > 0 && (
          <div className='flex items-center gap-2 mt-1'>
            <Rating rating={rating} />
            <span className='text-xs text-gray-500'>({numReviews})</span>
          </div>
        )}

        <p className='text-sm font-medium text-gray-600 mt-auto pt-1'>{currency}{price}</p>
      </div>
    </Link>
  );
};

export default ProductItem;