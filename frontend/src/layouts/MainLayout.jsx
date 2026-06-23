import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-transparent">

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-surface p-2 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                ChatPay<span className="text-primary">Shield</span>
              </span>
            </Link>
            {!isAuthPage && (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">Sign In</Link>
                <Link to="/register" className="bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="relative z-10 border-t border-white/5 bg-background/80 backdrop-blur-md py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ChatPayShield. All rights reserved. Designed for elite fintech platforms.
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
