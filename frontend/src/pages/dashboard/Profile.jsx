import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, backendUrl, userProfile, fetchUserProfile } =
    useContext(ShopContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    telebirrPhone: "",
    cbeAccount: "",
  });

  useEffect(() => {
    // Pre-fill form when userProfile data is loaded from context
    if (userProfile) {
      setFormData({
        telebirrPhone: userProfile.telebirrPhone || "",
        cbeAccount: userProfile.cbeAccount || "",
      });
    }
  }, [userProfile]);

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
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchUserProfile(token); // Refresh the global user profile data
        setEditMode(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile.");
    }
  };

  if (!userProfile)
    return <p className="text-center p-10">Loading profile data...</p>;

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
        <form
          onSubmit={handleUpdateProfile}
          className="bg-white p-6 rounded-lg shadow-sm border space-y-4 max-w-lg"
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
          <div className="flex gap-4 pt-2">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4 max-w-lg">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-lg font-medium">{userProfile.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="text-lg font-medium">{userProfile.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Telebirr Phone</p>
            <p className="text-lg font-medium">
              {userProfile.telebirrPhone || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CBE Account Number</p>
            <p className="text-lg font-medium">
              {userProfile.cbeAccount || "Not provided"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;
