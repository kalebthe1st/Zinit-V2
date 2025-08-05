import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { ShopContext } from '../../context/ShopContext';

const DashboardSidebar = () => {
  const activeStyle = {
    backgroundColor: '#FFF1F2', // Light pink
    borderColor: '#F43F5E', // Rose-500
    color: '#F43F5E',
    fontWeight: '600'
  };
  const { isSeller } = useContext(ShopContext);

  return (
    <div className='w-full md:w-[250px]'>
      <div className='flex flex-row md:flex-col gap-2 text-gray-700'>
        <NavLink
          to="/dashboard/profile"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          className='flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent'
        >
          <img className='w-5 h-5' src={assets.profile_icon} alt="Profile" />
          <p>My Profile</p>
        </NavLink>
        <NavLink
          to="/dashboard/my-orders"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          className='flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent'
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="Orders" />
          <p>My Orders</p>
        </NavLink>
         {isSeller && (
                    <>
                        <hr className="my-3" />
                        <p className="px-4 pt-2 pb-1 text-sm font-bold text-gray-400 uppercase">Seller Tools</p>
                        <NavLink to="/dashboard/add-product" style={({ isActive }) => (isActive ? activeStyle : undefined)} className='flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent'>
                            <img className='w-5 h-5' src={assets.add_icon} alt="Add Product" />
                            <p>Add Product</p>
                        </NavLink>
                        <NavLink to="/dashboard/my-products" style={({ isActive }) => (isActive ? activeStyle : undefined)} className='flex items-center gap-3 px-4 py-3 rounded border-l-4 border-transparent'>
                            <img className='w-5 h-5' src={assets.order_icon} alt="My Products" />
                            <p>My Products</p>
                        </NavLink>
                    </>
                )}
      </div>
    </div>
  );
};

export default DashboardSidebar;