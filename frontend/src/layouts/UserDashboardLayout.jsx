import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
const UserDashboardLayout = () => {
  return (
    <div className="flex flex-col md:flex-row container mx-auto py-8 gap-8 min-h-[60vh]">
      <DashboardSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
export default UserDashboardLayout;