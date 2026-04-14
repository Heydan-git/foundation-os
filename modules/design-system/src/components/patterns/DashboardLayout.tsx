import { Outlet, NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  Wallet, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  Command,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  Palette
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { name: "Vue d'ensemble", icon: LayoutDashboard, path: "/" },
  { name: "Analytique IA", icon: Cpu, path: "/ai" },
  { name: "Transactions", icon: Activity, path: "/txs" },
  { name: "Portefeuille", icon: Wallet, path: "/wallet" },
  { name: "Paramètres", icon: Settings, path: "/settings" },
  { name: "Design System", icon: Palette, path: "/design-system" },
];

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-ds-surface-0 text-ds-fg/80 font-sans selection:bg-ds-fg/10 overflow-hidden relative flex">
      {/* Global Background Dot Pattern for HUD Feel */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Extremity Glows */}
      <div className="fixed top-[-25%] left-[-15%] w-[60%] h-[60%] bg-ds-purple/10 blur-[150px] rounded-ds-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-25%] right-[-15%] w-[60%] h-[60%] bg-ds-blue/10 blur-[150px] rounded-ds-full pointer-events-none mix-blend-screen z-0" />

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex flex-col border-r border-white/[0.05] bg-[#050505]/75 backdrop-blur-3xl relative z-20 overflow-hidden"
        initial={false}
        animate={{
          width: isSidebarCollapsed ? 72 : 224,
          padding: isSidebarCollapsed ? 12 : 16,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3.5 top-8 bg-[#0a0a0a] border border-white/10 rounded-sm p-1 text-white/50 hover:text-white/90 hover:bg-white/[0.05] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all z-50 group"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <PanelLeftOpen size={12} className="group-hover:scale-110 transition-transform" />
          </motion.div>
        </button>

        <div className={`flex items-center gap-3 mb-8 group cursor-pointer ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="h-7 w-7 shrink-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md border border-white/10 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden group-hover:border-white/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <Command size={14} strokeWidth={1.5} className="text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] relative z-10" />
          </div>
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, width: 0, x: -8 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{ opacity: 0, width: 0, x: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="font-medium text-md tracking-wide text-white/90 whitespace-nowrap overflow-hidden"
              >
                Nexus
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-1 w-full">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 py-2 rounded-md transition-colors duration-200 relative text-xs font-medium ${
                  isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive
                    ? "text-white bg-white/[0.06] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.03)]"
                    : "text-white/40 hover:text-white/90 hover:bg-white/[0.03] border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={14} strokeWidth={isActive ? 2 : 1.5} className={`shrink-0 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/80 transition-colors"}`} />
                  <AnimatePresence mode="wait">
                    {!isSidebarCollapsed && (
                      <motion.span
                        key={`nav-label-${item.name}`}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                        className="relative z-10 whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !isSidebarCollapsed && <div className="absolute right-2 w-1 h-1 rounded-full bg-white/50" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <motion.div
          className="mt-auto bg-white/[0.02] border border-white/[0.05] relative group overflow-hidden shrink-0"
          initial={false}
          animate={{
            borderRadius: isSidebarCollapsed ? 8 : 12,
            padding: isSidebarCollapsed ? 0 : 12,
            height: isSidebarCollapsed ? 32 : "auto",
            width: isSidebarCollapsed ? 32 : "100%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ alignSelf: isSidebarCollapsed ? "center" : "stretch" }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <AnimatePresence mode="wait">
            {isSidebarCollapsed ? (
              <motion.button
                key="pro-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full rounded-md bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                title="Passer à Pro"
              >
                <Zap size={12} />
              </motion.button>
            ) : (
              <motion.div
                key="pro-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="relative z-10"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-white/90 whitespace-nowrap">Nexus Pro</h4>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                </div>
                <p className="text-[10px] text-white/40 mb-3 leading-relaxed">Débloquez les capacités d'IA avancées.</p>
                <button className="w-full py-1.5 rounded-md bg-white text-black hover:bg-white/90 text-[11px] font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] active:scale-[0.98] whitespace-nowrap">
                  Mettre à niveau
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header */}
        <header className="h-12 border-b border-white/[0.05] bg-[#050505]/75 backdrop-blur-2xl px-5 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-1.5 text-white/40 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={16} strokeWidth={1.5} />
            </button>
            <div className="hidden md:flex relative group/search">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md blur opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 text-white/30 group-focus-within/search:text-blue-400 transition-colors" size={12} />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="w-56 bg-[#0a0a0a] border border-white/[0.08] hover:border-white/[0.15] rounded-md pl-7 pr-3 py-1 text-xs text-white/90 placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all"
                />
                <div className="absolute right-1.5 px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] text-white/40 font-mono">
                  ⌘K
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-md hover:bg-white/[0.06] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white/40 hover:text-white/90 transition-all relative border border-transparent hover:border-white/[0.05]">
              <Bell size={14} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)]" />
            </button>
            
            <div className="h-3 w-[1px] bg-white/10 mx-1" />

            <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-white/80 text-[11px] font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Wallet size={12} strokeWidth={1.5} className="text-white/50" />
              <span className="font-mono tracking-tight">0x8A..2F9</span>
            </button>
            
            <button className="w-6 h-6 rounded-md overflow-hidden border border-white/10 ml-1 relative">
               <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="User Avatar" className="w-full h-full object-cover" />
               <div className="absolute inset-0 border border-white/20 rounded-md" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 pb-20">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#030303]/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-56 bg-[#050505] border-r border-white/5 z-50 flex flex-col p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 bg-white/10 rounded-md border border-white/10 flex items-center justify-center relative">
                    <div className="absolute top-0 left-0 w-1 h-1" />
                    <div className="absolute bottom-0 right-0 w-1 h-1" />
                    <Command size={14} strokeWidth={1.5} className="text-white/90" />
                  </div>
                  <span className="font-medium text-md text-white/90">Nexus</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white/90 p-1">
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-xs font-medium ${
                        isActive
                          ? "text-white bg-white/[0.06] border border-white/[0.05]"
                          : "text-white/40 hover:text-white/90 hover:bg-white/[0.03] border border-transparent"
                      }`
                    }
                  >
                    <item.icon size={14} strokeWidth={1.5} />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}