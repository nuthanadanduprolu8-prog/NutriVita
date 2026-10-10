import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { DisclaimerBanner } from '../common/MedicalDisclaimer';

const MainLayout = ({ children, hideFooter = false, showSidebar = false, sidebarComponent = null }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased pb-16 lg:pb-0">
      {/* Top CSP Disclaimer Notice */}
      <DisclaimerBanner />
      
      {/* Main Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      {showSidebar ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {sidebarComponent}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {children}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {children}
        </main>
      )}

      {/* Footer */}
      {!hideFooter && <Footer />}

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;
