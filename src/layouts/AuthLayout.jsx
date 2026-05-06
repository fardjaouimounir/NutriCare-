import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral text-text-dark font-ui">
      <Navbar hideLinks />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      <Footer minimal />
    </div>
  );
}
