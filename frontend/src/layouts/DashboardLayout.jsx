import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, ScanLine, List, PieChart, Activity, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'OCR Scanner', path: '/ocr', icon: ScanLine },
    { name: 'Transactions', path: '/transactions', icon: List },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Command Center', path: '/command-center', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-transparent flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface/40 backdrop-blur-md border-r border-white/5 flex flex-col relative z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-background/50 p-2 rounded-xl border border-white/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              ChatPay<span className="text-primary">Shield</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,229,255,0.1)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-danger/10 hover:text-danger transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Subtle Background Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-background/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <div className="flex items-center gap-4">
            <div className="bg-surface/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-gray-300">System Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-surface border-2 border-transparent flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'Admin'}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
