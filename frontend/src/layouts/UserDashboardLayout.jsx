import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { assets } from "../assets/assets"; // Make sure menu_icon is in your assets

const UserDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full min-h-[70vh]">
      {/* --- Responsive Sidebar --- */}
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* --- Main Content Area --- */}
      <div className="flex-1">
        {/* --- Hamburger Button (Mobile Only) --- */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 m-4 bg-gray-100 rounded-md hover:bg-gray-200"
          aria-label="Open sidebar"
        >
          <img src={assets.menu_icon} alt="Menu" className="w-6 h-6" />
        </button>

        {/* The content of the selected page will be rendered here */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
