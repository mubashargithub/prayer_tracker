import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNavBar from './BottomNavBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default Layout;
