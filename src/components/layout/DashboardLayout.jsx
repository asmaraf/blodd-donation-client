import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Droplet,
  LayoutDashboard,
  User,
  PlusCircle,
  ListFilter,
  Users,
  LogOut,
  Menu,
  X,
  Home,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

const DashboardLayout = () => {
  const { user, logout, isAdmin, isVolunteer } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
      isActive
        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/40'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
    }`;

  const renderNavLinks = () => (
    <div className="space-y-1.5">
      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        Main Navigation
      </div>

      <NavLink to="/dashboard" end className={navItemClass} onClick={() => setSidebarOpen(false)}>
        <LayoutDashboard className="w-4 h-4" />
        Dashboard Home
      </NavLink>

      <NavLink to="/dashboard/profile" className={navItemClass} onClick={() => setSidebarOpen(false)}>
        <User className="w-4 h-4" />
        My Profile
      </NavLink>

      {/* Donor specific */}
      {!isAdmin && !isVolunteer && (
        <>
          <NavLink
            to="/dashboard/my-donation-requests"
            className={navItemClass}
            onClick={() => setSidebarOpen(false)}
          >
            <ListFilter className="w-4 h-4 text-rose-400" />
            My Donation Requests
          </NavLink>

          <NavLink
            to="/dashboard/create-donation-request"
            className={navItemClass}
            onClick={() => setSidebarOpen(false)}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            Create Request
          </NavLink>
        </>
      )}

      {/* Admin specific */}
      {isAdmin && (
        <>
          <div className="px-3 py-1.5 pt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Admin Management
          </div>

          <NavLink
            to="/dashboard/all-users"
            className={navItemClass}
            onClick={() => setSidebarOpen(false)}
          >
            <Users className="w-4 h-4 text-purple-400" />
            All Users
          </NavLink>

          <NavLink
            to="/dashboard/all-blood-donation-request"
            className={navItemClass}
            onClick={() => setSidebarOpen(false)}
          >
            <ListFilter className="w-4 h-4 text-rose-400" />
            All Donation Requests
          </NavLink>
        </>
      )}

      {/* Volunteer specific */}
      {isVolunteer && !isAdmin && (
        <>
          <div className="px-3 py-1.5 pt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Volunteer Panel
          </div>

          <NavLink
            to="/dashboard/all-blood-donation-request"
            className={navItemClass}
            onClick={() => setSidebarOpen(false)}
          >
            <ListFilter className="w-4 h-4 text-rose-400" />
            All Donation Requests
          </NavLink>
        </>
      )}

      <div className="px-3 py-1.5 pt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        Quick Access
      </div>

      <Link
        to="/"
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition"
      >
        <Home className="w-4 h-4" />
        Public Website
      </Link>

      <Link
        to="/funding"
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition"
      >
        <HeartHandshake className="w-4 h-4 text-emerald-400" />
        Funding Ledger
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/90 glass-panel shrink-0 min-h-screen sticky top-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 shadow-md">
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Blood<span className="text-rose-500">Life</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://i.ibb.co/mJR6G1b/avatar-placeholder.png'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-500/30"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.name}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <StatusBadge status={user?.role} />
                {user?.status === 'blocked' && <StatusBadge status="blocked" />}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 overflow-y-auto">{renderNavLinks()}</nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden glass-panel border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-600">
            <Droplet className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-base font-extrabold text-white">BloodLife Dashboard</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 bg-slate-900 border border-slate-800 rounded-xl"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-900 h-full p-4 flex flex-col justify-between border-r border-slate-800 animate-in slide-in-from-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span className="font-bold text-white text-sm">Dashboard Menu</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-xl mb-4">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-100">{user?.name}</p>
                  <StatusBadge status={user?.role} />
                </div>
              </div>
              {renderNavLinks()}
            </div>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
                navigate('/');
              }}
              className="w-full py-2.5 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-xl"
            >
              Logout
            </button>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
