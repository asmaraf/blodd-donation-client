import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Droplet,
  LayoutDashboard,
  LogOut,
  HeartHandshake,
  FileText,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 shadow-md shadow-rose-950/50 group-hover:scale-105 transition">
            <Droplet className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Blood<span className="text-rose-500">Life</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-5">
          <Link
            to="/donation-requests"
            className={`text-sm font-semibold transition flex items-center gap-1.5 ${
              isActivePath('/donation-requests')
                ? 'text-rose-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Donation Requests
          </Link>

          {user && (
            <Link
              to="/funding"
              className={`text-sm font-semibold transition flex items-center gap-1.5 ${
                isActivePath('/funding')
                  ? 'text-rose-400 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              Funding
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700 transition shadow-sm shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {!user ? (
            <div className="flex items-center gap-3 ml-1 shrink-0">
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition border border-slate-300 dark:border-slate-700/60 shadow-sm shrink-0"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl shadow-lg shadow-rose-950/50 transition shrink-0"
              >
                Join as Donor
              </Link>
            </div>
          ) : (
            <div className="relative ml-1 shrink-0">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <img
                  src={user.avatar || 'https://i.ibb.co/mJR6G1b/avatar-placeholder.png'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-rose-500/30"
                />
                <span className="text-xs font-bold text-slate-200 hidden sm:inline">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
                    <p className="text-xs font-bold text-slate-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mb-1">{user.email}</p>
                    <StatusBadge status={user.role} />
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white rounded-xl transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-rose-500" />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme Toggle Button Mobile */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            className="p-2.5 text-amber-400 rounded-xl bg-slate-900 border border-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <Link
            to="/donation-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 py-2 border-b border-slate-800/60"
          >
            Donation Requests
          </Link>

          {user && (
            <Link
              to="/funding"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 py-2 border-b border-slate-800/60"
            >
              Funding
            </Link>
          )}

          {user ? (
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-800/60">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-rose-400 py-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="flex items-center gap-2 text-sm font-semibold text-rose-500 py-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl shadow-md"
              >
                Join as Donor
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
