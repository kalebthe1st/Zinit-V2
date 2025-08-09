import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/all`, {
                headers: { token }
            });
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch users.");
        }
    };

    useEffect(() => {
        if (token) fetchAllUsers();
    }, [token]);

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete the user "${userName}"? This will also delete all their products.`)) {
            try {
                const response = await axios.delete(`${backendUrl}/api/user/${userId}`, {
                    headers: { token }
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    await fetchAllUsers(); // Refresh the list
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to delete user.");
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.isSeller 
                                        ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Seller</span>
                                        : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Buyer</span>
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => navigate(`/user/${user._id}`)} className="text-indigo-600 hover:text-indigo-900 mr-4">View Products</button>
                                    <button onClick={() => handleDeleteUser(user._id, user.name)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;