import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Sidebar } from '../components/common/Sidebar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral text-text-dark font-ui overflow-x-hidden">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 container mx-auto px-4 lg:px-8 mt-6">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 w-full relative min-h-[calc(100vh-80px)] lg:bg-transparent lg:ps-6">
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
