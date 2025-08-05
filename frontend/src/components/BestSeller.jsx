// --- START OF FILE BestSeller.jsx ---

import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem'; // Ensure this is imported

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState([])
    const { products } = useContext(ShopContext)

    useEffect(() => {
        if (products && products.length > 0) {
            const bestProducts = products.filter((item) => item.bestseller);
            setBestSeller(bestProducts.slice(0, 5));
        }
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"BEST"} text2={"SELLERS"} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Check out our top-rated and most popular items, loved by customers.</p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    bestSeller.map((item) => (
                        // --- THIS IS THE FIX ---
                        // Pass the entire 'item' object as the 'product' prop
                        <ProductItem key={item._id} product={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller;