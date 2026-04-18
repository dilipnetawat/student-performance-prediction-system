import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Brain, Bell, LogOut, Menu, X, GraduationCap, Sun, Moon,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true, roles: ['admin', 'teacher', 'student'] },
  { to: '/app/students', icon: Users, label: 'Students', roles: ['admin', 'teacher', 'student'] },
  { to: '/app/predictions', icon: Brain, label: 'Predictions', roles: ['admin', 'teacher'] },
  { to: '/app/notifications', icon: Bell, label: 'Notifications', roles: ['admin', 'teacher', 'student'] },
];

export function Layout() {
  const { user, logout, notifications, theme, toggleTheme } = useStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unread = notifications.filter(n => !n.isRead).length;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full bg-white border-r border-gray-200 flex flex-col">
          <div className="p-5 flex items-center justify-between">
            <Link to="/app" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">TrackEd</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Predict Success</p>
              </div>
            </Link>
            <button onClick={() => setOpen(false)} className="lg:hidden p-2 text-gray-400">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {NAV.filter(item => !user?.role || item.roles.includes(user.role)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.label === 'Notifications' && unread > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {unread}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User card */}
          <div className="p-3 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 text-gray-500">
              <Menu size={20} />
            </button>
            <div className="flex-1" />
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link
              to="/app/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
