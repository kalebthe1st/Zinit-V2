import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
// You might need an asset for an "edit" icon later
// import { assets } from '../../assets/assets'; 

const MyProducts = () => {
    // Destructure everything you need from context
    const { token, backendUrl, currency } = useContext(ShopContext);
    const [myProducts, setMyProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyProducts = async () => {
        // Ensure we don't run this without a token
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // --- THIS IS THE CRITICAL FIX ---
            // Change the API endpoint from '/api/product/list' 
            // to the secure, user-specific '/api/product/user/list'
            const response = await axios.get(`${backendUrl}/api/product/user/list`, {
                headers: { token } // The token is required for the sellerAuth middleware
            });

            if (response.data.success) {
                // Sort by date to show the newest products first
                setMyProducts(response.data.products.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } else {
                // This toast will now show the message from sellerAuth if the user is not a seller
                toast.error(response.data.message);
            }
        } catch (error) {
            // This will catch network errors or if the server crashes (500 errors)
            toast.error("An error occurred while fetching your products.");
            console.error("Fetch My Products Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, [token]); // Re-run the fetch if the token changes

    // Optional: Add a function to handle deleting a product
    const handleDeleteProduct = async (productId) => {
        // You would need to create a DELETE endpoint like '/api/product/user/delete/:id'
        // and protect it with sellerAuth. It should also verify that the
        // product being deleted actually belongs to the user.
        console.log("Deleting product:", productId);
        toast.info("Delete functionality not yet implemented.");
    };

    if (isLoading) {
        return <p className="p-10 text-center">Loading your products...</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Listed Products</h2>
            <div className="flex flex-col gap-4">
                {myProducts.length === 0 ? (
                    <p className="p-10 text-center bg-gray-50 rounded-md">You haven't listed any products yet. Click "Add Product" to get started!</p>
                ) : (
                    myProducts.map((product) => (
                        <div key={product._id} className="grid grid-cols-[auto_1fr_auto_auto] items-center border p-3 rounded-lg gap-4">
                            <img src={product.image[0]} alt={product.name} className="w-16 h-16 object-cover rounded"/>
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-gray-600 font-medium">{currency}{product.price}</p>
                            <div className="flex gap-4">
                                <button className="text-sm text-blue-600 hover:underline">Edit</button>
                                <button onClick={() => handleDeleteProduct(product._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyProducts;