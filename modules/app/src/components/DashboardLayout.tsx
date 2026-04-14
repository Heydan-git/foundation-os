import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sword,
  BookOpen,
  Bell,
  Search,
  Menu,
  X,
  Command,
  PanelLeftOpen,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/lib/AuthContext'

const NAV_ITEMS = [
  { name: 'Vue d\u2019ensemble', icon: LayoutDashboard, path: '/' },
  { name: 'Commander', icon: Sword, path: '/commander' },
  { name: 'Knowledge', icon: BookOpen, path: '/knowledge' },
]

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { user, signOut } = useAuth()

  const userEmail = user?.email ?? ''
  const userInitial = userEmail.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-ds-surface-0 text-ds-fg/80 font-sans selection:bg-ds-fg/10 overflow-hidden relative flex">
      {/* Global Background Dot Pattern for HUD Feel */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
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
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3.5 top-8 bg-[#0a0a0a] border border-white/10 rounded-sm p-1 text-white/50 hover:text-white/90 hover:bg-white/[0.05] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all z-50 group"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <PanelLeftOpen size={12} className="group-hover:scale-110 transition-transform" />
          </motion.div>
        </button>

        <div
          className={`flex items-center gap-3 mb-8 group cursor-pointer ${isSidebarCollapsed ? 'justify-center' : ''}`}
        >
          <div className="h-7 w-7 shrink-0 bg-gradient-to-br from-ds-blue/20 to-ds-purple/20 rounded-md border border-white/10 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden group-hover:border-white/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-ds-blue/10 to-ds-purple/10 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <Command
              size={14}
              strokeWidth={1.5}
              className="text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] relative z-10"
            />
          </div>
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, width: 0, x: -8 }}
                animate={{ opacity: 1, width: 'auto', x: 0 }}
                exit={{ opacity: 0, width: 0, x: -8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="font-medium text-md tracking-wide text-white/90 whitespace-nowrap overflow-hidden"
              >
                Foundation OS
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-1 w-full">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 py-2 rounded-md transition-colors duration-200 relative text-xs font-medium ${
                  isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive
                    ? 'text-white bg-white/[0.06] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.03)]'
                    : 'text-white/40 hover:text-white/90 hover:bg-white/[0.03] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={14}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`shrink-0 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80 transition-colors'}`}
                  />
                  <AnimatePresence mode="wait">
                    {!isSidebarCollapsed && (
                      <motion.span
                        key={`nav-label-${item.name}`}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15, ease: 'easeInOut' }}
                        className="relative z-10 whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !isSidebarCollapsed && (
                    <div className="absolute right-2 w-1 h-1 rounded-full bg-white/50" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <motion.div
          className="mt-auto bg-white/[0.02] border border-white/[0.05] relative group overflow-hidden shrink-0"
          initial={false}
          animate={{
            borderRadius: isSidebarCollapsed ? 8 : 12,
            padding: isSidebarCollapsed ? 0 : 12,
            height: isSidebarCollapsed ? 32 : 'auto',
            width: isSidebarCollapsed ? 32 : '100%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ alignSelf: isSidebarCollapsed ? 'center' : 'stretch' }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <AnimatePresence mode="wait">
            {isSidebarCollapsed ? (
              <motion.button
                key="user-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={signOut}
                className="w-full h-full rounded-md bg-white/[0.06] text-white/60 flex items-center justify-center hover:bg-white/[0.1] hover:text-white/90 transition-all border border-white/[0.05]"
                title="Deconnexion"
              >
                <span className="text-[10px] font-mono font-bold">{userInitial}</span>
              </motion.button>
            ) : (
              <motion.div
                key="user-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="relative z-10"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-white/90 whitespace-nowrap truncate max-w-[130px]">
                    {userEmail}
                  </h4>
                  <div className="w-1.5 h-1.5 rounded-full bg-ds-emerald animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <p className="text-[10px] text-white/40 mb-3 leading-relaxed">Connecte</p>
                <button
                  onClick={signOut}
                  className="w-full py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/60 hover:text-white/90 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <LogOut size={10} /> Deconnexion
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
              <div className="absolute inset-0 bg-gradient-to-r from-ds-blue/10 to-ds-purple/10 rounded-md blur opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search
                  className="absolute left-2.5 text-white/30 group-focus-within/search:text-ds-blue transition-colors"
                  size={12}
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-56 bg-[#0a0a0a] border border-white/[0.08] hover:border-white/[0.15] rounded-md pl-7 pr-3 py-1 text-xs text-white/90 placeholder:text-white/30 focus:outline-none focus:border-ds-blue/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all"
                />
                <div className="absolute right-1.5 px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] text-white/40 font-mono">
                  \u2318K
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-md hover:bg-white/[0.06] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white/40 hover:text-white/90 transition-all relative border border-transparent hover:border-white/[0.05]">
              <Bell size={14} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-ds-blue shadow-[0_0_8px_rgba(96,165,250,1)]" />
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
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-56 bg-[#050505] border-r border-white/5 z-50 flex flex-col p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 bg-gradient-to-br from-ds-blue/20 to-ds-purple/20 rounded-md border border-white/10 flex items-center justify-center relative">
                    <Command size={14} strokeWidth={1.5} className="text-white/90" />
                  </div>
                  <span className="font-medium text-md text-white/90">Foundation OS</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/40 hover:text-white/90 p-1"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-all text-xs font-medium ${
                        isActive
                          ? 'text-white bg-white/[0.06] border border-white/[0.05]'
                          : 'text-white/40 hover:text-white/90 hover:bg-white/[0.03] border border-transparent'
                      }`
                    }
                  >
                    <item.icon size={14} strokeWidth={1.5} />
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              {/* Mobile user section */}
              <div className="mt-auto pt-4 border-t border-white/[0.05]">
                <p className="text-[10px] text-white/40 font-mono truncate mb-2">{userEmail}</p>
                <button
                  onClick={signOut}
                  className="w-full py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/60 text-[11px] font-medium flex items-center justify-center gap-1.5"
                >
                  <LogOut size={10} /> Deconnexion
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
