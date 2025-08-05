import React from 'react';
import { assets } from '../assets/assets';

const Rating = ({ rating }) => {
  // Ensure rating is a number, default to 0 if not
  const numericRating = Number(rating) || 0;
  
  const fullStars = Math.floor(numericRating);
  const emptyStars = 5 - fullStars;

  return (
    <div className='flex items-center'>
      {[...Array(fullStars)].map((_, index) => (
        <img key={`full-${index}`} src={assets.star_icon} alt="Full Star" className='w-4 h-4' />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <img key={`empty-${index}`} src={assets.star_dull_icon} alt="Empty Star" className='w-4 h-4' />
      ))}
    </div>
  );
};

export default Rating;