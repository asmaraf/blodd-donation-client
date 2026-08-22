import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ListFilter, Eye, Edit, Trash2, CheckCircle2, XCircle, Droplet, Shield, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';

const AllDonationRequestsPage = () => {
  const { user, isAdmin, isVolunteer } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchAllRequests = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ page: page.toString(), limit: '10' });
      if (status) queryParams.append('status', status);

      const res = await api.get(`/donations/all?${queryParams.toString()}`);
      setRequests(res.data.requests || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
    } catch (error) {
      console.error('Fetch all requests error:', error);
      toast.error('Failed to load donation requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests(currentPage, filterStatus);
  }, [currentPage, filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/donations/${id}/status`, { status: newStatus });
      toast.success(`Request status updated to ${newStatus}`);
      fetchAllRequests(currentPage, filterStatus);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update request status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/donations/${deleteTargetId}`);
      toast.success('Donation request deleted');
      fetchAllRequests(currentPage, filterStatus);
    } catch (error) {
      console.error('Delete request error:', error);
      toast.error('Failed to delete request.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-rose-500" /> All Blood Donation Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin
              ? 'Admin control panel: Full permissions to update status, edit, or remove any request.'
              : 'Volunteer console: Filter requests and update donation statuses.'}
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300">Status Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-rose-500 transition"
          >
            <option value="">All Requests</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Loading donation requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-2">
            <Droplet className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="font-semibold text-slate-400">No Requests Found</p>
            <p className="text-[11px]">No requests match your current status filter.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Recipient Name</th>
                    <th className="px-4 py-3.5">Requester Info</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Date & Time</th>
                    <th className="px-4 py-3.5">Blood Group</th>
                    <th className="px-4 py-3.5">Status & Action</th>
                    <th className="px-4 py-3.5">Assigned Donor</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-800/60 transition">
                      <td className="px-4 py-4 font-bold text-slate-100">{req.recipientName}</td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-white">{req.requesterName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{req.requesterEmail}</p>
                      </td>

                      <td className="px-4 py-4 text-slate-300">
                        {req.recipientUpazila}, {req.recipientDistrict}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-200">{req.donationDate}</div>
                        <div className="text-[11px] text-slate-400">{req.donationTime}</div>
                      </td>

                      <td className="px-4 py-4">
                        <BloodGroupBadge bloodGroup={req.bloodGroup} />
                      </td>

                      {/* Status Update (Allowed for BOTH Admin and Volunteer) */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <StatusBadge status={req.status} />

                          {/* Quick status dropdown for Volunteers and Admins */}
                          <div className="pt-1">
                            <select
                              value={req.status}
                              onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1 outline-none focus:border-rose-500 transition"
                            >
                              <option value="pending">Pending</option>
                              <option value="inprogress">In Progress</option>
                              <option value="done">Done</option>
                              <option value="canceled">Canceled</option>
                            </select>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs">
                        {req.donorInfo?.name ? (
                          <div>
                            <p className="font-bold text-white">{req.donorInfo.name}</p>
                            <p className="text-slate-400 font-mono">{req.donorInfo.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View details - Allowed for all */}
                          <button
                            onClick={() => navigate(`/donation-requests/${req._id}`)}
                            title="View Details"
                            className="p-2 rounded-xl bg-slate-800/90 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700/80 transition shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit & Delete ONLY ALLOWED FOR ADMIN */}
                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)}
                                title="Edit Request (Admin Only)"
                                className="p-2 rounded-xl bg-slate-800/90 hover:bg-blue-600 hover:text-white text-blue-400 border border-slate-700/80 transition shadow-sm"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(req._id)}
                                title="Delete Request (Admin Only)"
                                className="p-2 rounded-xl bg-slate-800/90 hover:bg-rose-600 hover:text-white text-rose-400 border border-slate-700/80 transition shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">No Edit/Del</span>
                          )}
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
        title="Admin Delete Request"
        message="Are you sure you want to permanently delete this donation request?"
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};

export default AllDonationRequestsPage;
