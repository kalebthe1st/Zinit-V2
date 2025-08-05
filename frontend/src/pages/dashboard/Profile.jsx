import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const Profile = () => {
    const { token, backendUrl } = useContext(ShopContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/user/profile`, {
                    headers: { token }
                });
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    toast.error("Could not fetch profile.");
                }
            } catch (error) {
                toast.error("Error fetching your profile.");
            }
        };
        if (token) fetchUserProfile();
    }, [token]);

    if (!user) return <p className="text-center p-10">Loading...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-lg font-medium">{user.email}</p>
                </div>
            </div>
        </div>
    );
};
export default Profile;