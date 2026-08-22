import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { StatusBadge } from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { Users, MoreVertical, ShieldAlert, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Active open dropdown row id
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const fetchUsers = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ page: page.toString(), limit: '10' });
      if (status) queryParams.append('status', status);

      const res = await api.get(`/users?${queryParams.toString()}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, filterStatus);
  }, [currentPage, filterStatus]);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      setActiveDropdownId(null);
      fetchUsers(currentPage, filterStatus);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      setActiveDropdownId(null);
      fetchUsers(currentPage, filterStatus);
    } catch (error) {
      console.error('Role update error:', error);
      toast.error('Failed to update user role.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Status Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" /> All Platform Users
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Admin management console for user roles and status moderation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300">Filter Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-rose-500 transition"
          >
            <option value="">All Users</option>
            <option value="active">Active Users</option>
            <option value="blocked">Blocked Users</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Loading user list...
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">No users matching filter criteria.</div>
        ) : (
          <div>
            <div className="overflow-x-auto min-h-[350px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">User</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Blood Group</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-900/40 transition relative">
                      <td className="px-4 py-3.5 font-bold text-slate-100 flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://i.ibb.co/mJR6G1b/avatar-placeholder.png'}
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {u.upazila}, {u.district}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-400 font-mono">{u.email}</td>

                      <td className="px-4 py-3.5 font-extrabold text-rose-400">{u.bloodGroup}</td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={u.role} />
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={u.status} />
                      </td>

                      <td className="px-4 py-3.5 text-right relative">
                        {/* 3-Dot Action Menu Button */}
                        <button
                          onClick={() => setActiveDropdownId(activeDropdownId === u._id ? null : u._id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {activeDropdownId === u._id && (
                          <div className="absolute right-4 top-12 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 text-left space-y-1">
                            {/* Block / Unblock Toggle */}
                            {u.status === 'active' ? (
                              <button
                                onClick={() => handleStatusToggle(u._id, 'active')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                              >
                                <ShieldAlert className="w-4 h-4" /> Block User
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusToggle(u._id, 'blocked')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition"
                              >
                                <ShieldCheck className="w-4 h-4" /> Unblock User
                              </button>
                            )}

                            {/* Make Volunteer */}
                            {u.role !== 'volunteer' && (
                              <button
                                onClick={() => handleRoleChange(u._id, 'volunteer')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition"
                              >
                                <UserCheck className="w-4 h-4" /> Make Volunteer
                              </button>
                            )}

                            {/* Make Admin */}
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleRoleChange(u._id, 'admin')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-purple-400 hover:bg-purple-500/10 rounded-xl transition"
                              >
                                <Shield className="w-4 h-4" /> Make Admin
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
