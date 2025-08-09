import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { token, backendUrl } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the existing product data when the component mounts
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // We need a GET endpoint for a single product that works for sellers
                // Re-using the public `singleProduct` controller for this is fine if secured
                const response = await axios.post(`${backendUrl}/api/product/single`, { productId });
                if (response.data.success) {
                    const { name, description, price, original_price } = response.data.product;
                    setFormData({
                        name,
                        description,
                        price,
                        original_price: original_price || ''
                    });
                } else {
                    toast.error("Could not fetch product data.");
                }
            } catch (error) {
                toast.error("Error fetching product data.");
            } finally {
                setIsLoading(false);
            }
        };
        if (token) fetchProductData();
    }, [productId, token, backendUrl]);

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${backendUrl}/api/product/user/update/${productId}`, formData, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success("Product updated successfully!");
                navigate('/dashboard/my-products');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the product.");
        }
    };

    if (isLoading) return <p>Loading product details...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 p-4 border rounded-lg bg-white">
                <div>
                    <label className="font-medium">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={onChangeHandler} className="w-full mt-1 p-2 border rounded" required />
                </div>
                <div>
                    <label className="font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={onChangeHandler} className="w-full mt-1 p-2 border rounded" rows="4" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium">Original Price (for sales)</label>
                        <input type="number" name="original_price" value={formData.original_price} onChange={onChangeHandler} className="w-full mt-1 p-2 border rounded" placeholder="e.g., 120" />
                    </div>
                    <div>
                        <label className="font-medium">Current Price</label>
                        <input type="number" name="price" value={formData.price} onChange={onChangeHandler} className="w-full mt-1 p-2 border rounded" required />
                    </div>
                </div>
                <p className="text-xs text-gray-500">To put an item on sale, enter a value in 'Original Price' that is higher than the 'Current Price'. Otherwise, leave it blank.</p>
                <button type="submit" className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProduct;