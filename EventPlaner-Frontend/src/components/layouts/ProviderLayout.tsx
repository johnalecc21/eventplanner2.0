// components/layouts/ProviderLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProviderNavbar from '../organisms/navbar/ProviderNavbar';

const ProviderLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar />
      <main className="container mx-auto px-4 py-8 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderLayout;