
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'bookings', label: 'Events', icon: 'fa-ring' },
    { id: 'viewings', label: 'Appointments', icon: 'fa-calendar-check' },
    { id: 'availability', label: 'Availability', icon: 'fa-calendar-alt' },
    { id: 'menus', label: 'Package Mngmt', icon: 'fa-utensils' },
  ];

  return (
    <div className="flex h-screen bg-[#fcfaf7] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#3d2b1f] text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-[#4d3a2d] flex flex-col items-center text-center">
          <h2 className="text-xl font-serif font-bold tracking-widest text-[#a67c52]">ISTIADAT</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#d2b48c] mt-1 font-medium">Wedding & Events</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-[#a67c52] text-white shadow-lg translate-x-1' 
                : 'text-[#d2b48c] hover:bg-[#4d3a2d] hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-lg ${activeTab === item.id ? 'text-white' : 'text-[#a67c52]'}`}></i>
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[#4d3a2d] bg-[#34241a]">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#a67c52] flex items-center justify-center text-sm font-serif font-bold text-[#a67c52]">
              IA
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Istiadat Admin</p>
              <p className="text-[10px] uppercase tracking-wider text-[#a67c52]">Owner Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-10 shrink-0">
          <h1 className="text-2xl font-serif font-bold text-[#3d2b1f]">
            {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Venue Status</p>
              <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Operational
              </p>
            </div>
            <div className="h-10 w-px bg-stone-200"></div>
            <button className="relative text-stone-400 hover:text-[#a67c52] transition-colors">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#a67c52] border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-[#fcfaf7]">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
