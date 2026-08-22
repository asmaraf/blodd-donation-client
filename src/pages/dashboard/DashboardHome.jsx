import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import {
  Users,
  DollarSign,
  Droplet,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ListFilter,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';

const DashboardHome = () => {
  const { user, isAdmin, isVolunteer } = useAuth();
  const navigate = useNavigate();

  // Donor state
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingDonorReqs, setLoadingDonorReqs] = useState(true);

  // Admin/Volunteer state
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Confirm delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchDonorRecentRequests = async () => {
    try {
      const res = await api.get('/donations/my-requests?limit=3');
      setRecentRequests(res.data.requests || []);
    } catch (error) {
      console.error('Fetch recent requests error:', error);
    } finally {
      setLoadingDonorReqs(false);
    }
  };

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/stats/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isVolunteer) {
      fetchDashboardStats();
    } else {
      fetchDonorRecentRequests();
    }
  }, [isAdmin, isVolunteer]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/donations/${id}/status`, { status: newStatus });
      toast.success(`Request status updated to ${newStatus}`);
      fetchDonorRecentRequests();
    } catch (error) {
      console.error('Status change error:', error);
      toast.error('Failed to update request status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/donations/${deleteTargetId}`);
      toast.success('Donation request deleted successfully');
      fetchDonorRecentRequests();
    } catch (error) {
      console.error('Delete request error:', error);
      toast.error('Failed to delete donation request.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const COLORS = ['#e11d48', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-rose-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              {user?.role?.toUpperCase()} DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome back, <span className="gradient-text">{user?.name}</span>! 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isAdmin || isVolunteer
                ? 'Here is an overview of platform metrics and donation activity.'
                : 'Manage your active blood donation requests or create a new request.'}
            </p>
          </div>

          {!isAdmin && !isVolunteer && (
            <Link
              to="/dashboard/create-donation-request"
              className="px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" /> Create Donation Request
            </Link>
          )}
        </div>
      </div>

      {/* ADMIN & VOLUNTEER VIEW */}
      {(isAdmin || isVolunteer) && (
        <div className="space-y-8">
          {/* 3 Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Stat Card 1: Total Donors */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Users (Donors)
                </span>
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">
                {stats?.totalDonors !== undefined ? stats.totalDonors : '...'}
              </p>
              <p className="text-[11px] text-slate-500">Registered platform donors</p>
            </div>

            {/* Stat Card 2: Total Funding */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Funding
                </span>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">
                ${stats?.totalFunding !== undefined ? stats.totalFunding.toLocaleString() : '0'}
              </p>
              <p className="text-[11px] text-slate-500">Collected support fund</p>
            </div>

            {/* Stat Card 3: Total Requests */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Donation Requests
                </span>
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                  <Droplet className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-rose-400">
                {stats?.totalRequests !== undefined ? stats.totalRequests : '...'}
              </p>
              <p className="text-[11px] text-slate-500">Created blood requests</p>
            </div>
          </div>

          {/* Analytics Charts (Recharts) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status breakdown bar chart */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                Requests Status Overview
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Pending', count: stats?.statusCounts?.pending || 0 },
                      { name: 'In Progress', count: stats?.statusCounts?.inprogress || 0 },
                      { name: 'Done', count: stats?.statusCounts?.done || 0 },
                      { name: 'Canceled', count: stats?.statusCounts?.canceled || 0 },
                    ]}
                  >
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#e11d48" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Blood group stats pie chart */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Blood Group Demand Breakdown
              </h3>
              <div className="h-64 flex items-center justify-center">
                {stats?.bloodGroupStats?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.bloodGroupStats.map((b) => ({
                          name: b._id,
                          value: b.count,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {stats.bloodGroupStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-500">No blood group demand data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DONOR VIEW: Recent 3 Donation Requests */}
      {!isAdmin && !isVolunteer && (
        <div className="space-y-6">
          {loadingDonorReqs ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading recent donation requests...
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Your Recent Donation Requests</h3>
                  <p className="text-xs text-slate-400">
                    Showing your maximum 3 recent requests.
                  </p>
                </div>

                <Link
                  to="/dashboard/my-donation-requests"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
                >
                  View My All Request <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Recipient</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Blood Group</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Donor Info</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {recentRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-900/40 transition">
                        <td className="px-4 py-3 font-bold text-slate-100">{req.recipientName}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {req.recipientUpazila}, {req.recipientDistrict}
                        </td>
                        <td className="px-4 py-3">
                          <div>{req.donationDate}</div>
                          <div className="text-[10px] text-slate-500">{req.donationTime}</div>
                        </td>
                        <td className="px-4 py-3">
                          <BloodGroupBadge bloodGroup={req.bloodGroup} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={req.status} />

                          {/* Done & Cancel buttons show ONLY when status is inprogress */}
                          {req.status === 'inprogress' && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <button
                                onClick={() => handleStatusChange(req._id, 'done')}
                                className="px-2 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </button>
                              <button
                                onClick={() => handleStatusChange(req._id, 'canceled')}
                                className="px-2 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                              >
                                <XCircle className="w-3 h-3" /> Cancel
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          {req.status === 'inprogress' && req.donorInfo?.name ? (
                            <div>
                              <p className="font-bold text-white">{req.donorInfo.name}</p>
                              <p className="text-slate-400 font-mono">{req.donorInfo.email}</p>
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/donation-requests/${req._id}`)}
                              title="View Details"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)}
                              title="Edit Request"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(req._id)}
                              title="Delete Request"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All Button below table */}
              <div className="pt-4 border-t border-slate-800 flex justify-center">
                <Link
                  to="/dashboard/my-donation-requests"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition"
                >
                  View My All Request
                </Link>
              </div>
            </div>
          ) : (
            // Hidden/Empty state message if 0 requests
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3">
              <Droplet className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No Donation Requests Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need blood for yourself or a loved one? Click below to post a request.
              </p>
              <Link
                to="/dashboard/create-donation-request"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition"
              >
                <PlusCircle className="w-4 h-4" /> Create Request Now
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Donation Request"
        message="Are you sure you want to permanently delete this donation request? This action cannot be undone."
        confirmText="Delete Request"
        isDanger={true}
      />
    </div>
  );
};

export default DashboardHome;
