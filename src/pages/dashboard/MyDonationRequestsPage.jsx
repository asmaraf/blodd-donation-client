import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ListFilter, Eye, Edit, Trash2, CheckCircle2, XCircle, Droplet } from 'lucide-react';
import toast from 'react-hot-toast';

const MyDonationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const navigate = useNavigate();

  const fetchMyRequests = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ page: page.toString(), limit: '10' });
      if (status) queryParams.append('status', status);

      const res = await api.get(`/donations/my-requests?${queryParams.toString()}`);
      setRequests(res.data.requests || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.total || 0);
      setCurrentPage(res.data.page || 1);
    } catch (error) {
      console.error('Fetch my requests error:', error);
      toast.error('Failed to load donation requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests(currentPage, filterStatus);
  }, [currentPage, filterStatus]);

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/donations/${id}/status`, { status: newStatus });
      toast.success(`Request status changed to ${newStatus}`);
      fetchMyRequests(currentPage, filterStatus);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/donations/${deleteTargetId}`);
      toast.success('Donation request deleted');
      fetchMyRequests(currentPage, filterStatus);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete request.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-rose-500" /> My Donation Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View and manage all blood requests created by you.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-rose-500 transition"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Loading your donation requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-2">
            <Droplet className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="font-semibold text-slate-400">No Donation Requests Found</p>
            <p className="text-[11px]">You haven't requested any blood for this status filter.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Recipient Name</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Date & Time</th>
                    <th className="px-4 py-3.5">Blood Group</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Donor Info</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-900/40 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-100">{req.recipientName}</td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {req.recipientUpazila}, {req.recipientDistrict}
                      </td>
                      <td className="px-4 py-3.5">
                        <div>{req.donationDate}</div>
                        <div className="text-[10px] text-slate-500">{req.donationTime}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <BloodGroupBadge bloodGroup={req.bloodGroup} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={req.status} />

                        {/* Inprogress toggle buttons */}
                        {req.status === 'inprogress' && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <button
                              onClick={() => handleStatusUpdate(req._id, 'done')}
                              className="px-2 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(req._id, 'canceled')}
                              className="px-2 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Cancel
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[11px]">
                        {req.status === 'inprogress' && req.donorInfo?.name ? (
                          <div>
                            <p className="font-bold text-white">{req.donorInfo.name}</p>
                            <p className="text-slate-400 font-mono">{req.donorInfo.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Donation Request"
        message="Are you sure you want to permanently delete this request? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};

export default MyDonationRequestsPage;
