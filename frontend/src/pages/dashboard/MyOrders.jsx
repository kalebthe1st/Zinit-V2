import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { token, backendUrl, currency } = useContext(ShopContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/order/my-orders`, {
                    headers: { token }
                });
                if (response.data.success) {
                    setOrders(response.data.orders.sort((a, b) => b.date - a.date));
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch orders.");
            }
        };
        if (token) fetchUserOrders();
    }, [token]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            <div className="flex flex-col gap-5">
                {orders.length === 0 ? (
                    <p className='p-10 text-center bg-gray-50 rounded-md'>You have no orders yet.</p>
                ) : (
                    orders.map((order, index) => (
                        <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr] items-start gap-4 border p-5 rounded-lg text-sm text-gray-700' key={index}>
                            <img className='w-12 mt-1' src={assets.parcel_icon} alt="Parcel" />
                            <div>
                                <p className='font-semibold text-black'>
                                    {order.items.map((item, idx) => `${item.name} x ${item.quantity}${idx === order.items.length - 1 ? '' : ', '}`)}
                                </p>
                                <p className="mt-2 mb-1 font-medium">{order.address.firstName} {order.address.lastName}</p>
                            </div>
                            <p className='font-semibold'>{currency}{order.amount}</p>
                            <div>
                                <p>Status: <b className='text-pink-600'>{order.status}</b></p>
                                <p className="text-xs text-gray-500 mt-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default MyOrders;