import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    telebirrPhone: "",
    cbeAccount: "",
  });

  // Fetch profile data when the component loads
  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });
      if (response.data.success) {
        setUser(response.data.user);
        // Pre-fill the form with existing data
        setFormData({
          telebirrPhone: response.data.user.telebirrPhone || "",
          cbeAccount: response.data.user.cbeAccount || "",
        });
      } else {
        toast.error("Could not fetch profile.");
      }
    } catch (error) {
      toast.error("Error fetching your profile.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        formData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setUser(response.data.user); // Update the displayed user data
        setEditMode(false); // Exit edit mode
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile.");
    }
  };

  if (!user) return <p className="text-center p-10">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-gray-200 text-gray-800 px-4 py-2 text-sm rounded-md hover:bg-gray-300"
          >
            Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        // --- EDIT MODE FORM ---
        <form
          onSubmit={handleUpdateProfile}
          className="bg-white p-6 rounded-lg shadow-sm border space-y-4"
        >
          <div>
            <label
              htmlFor="telebirrPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Telebirr Phone
            </label>
            <input
              type="tel"
              id="telebirrPhone"
              name="telebirrPhone"
              value={formData.telebirrPhone}
              onChange={onChangeHandler}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., 0912345678"
            />
          </div>
          <div>
            <label
              htmlFor="cbeAccount"
              className="block text-sm font-medium text-gray-700"
            >
              CBE Account Number
            </label>
            <input
              type="text"
              id="cbeAccount"
              name="cbeAccount"
              value={formData.cbeAccount}
              onChange={onChangeHandler}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., 1000..."
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-white text-gray-800 px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // --- DISPLAY MODE ---
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Telebirr Phone</p>
            <p className="text-lg font-medium">
              {user.telebirrPhone || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CBE Account Number</p>
            <p className="text-lg font-medium">
              {user.cbeAccount || "Not provided"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;
