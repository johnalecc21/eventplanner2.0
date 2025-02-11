// components/layouts/PlainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const PlainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PlainLayout;