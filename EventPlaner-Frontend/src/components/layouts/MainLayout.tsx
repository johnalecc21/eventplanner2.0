// components/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../organisms/navbar/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;