import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { StickyBottomBar } from './StickyBottomBar';
import { Footer } from './Footer';
import { FloatingCTA } from '../ui/FloatingCTA';
import { Plus } from 'lucide-react';

export const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <StickyBottomBar />
      <BottomNav />
      {/* Signature Frap Floating CTA */}
      <FloatingCTA icon={<Plus color="#fff" />} ariaLabel="Quick action" />
    </>
  );
};
