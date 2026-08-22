import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { Droplet, MapPin, Calendar, Clock, Eye, Hospital, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DonationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await api.get('/donations/pending');
        setRequests(res.data.requests || []);
      } catch (error) {
        console.error('Failed to load donation requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleViewClick = (id) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/donation-requests/${id}` } } });
    } else {
      navigate(`/donation-requests/${id}`);
    }
  };

  const filteredRequests = filterBloodGroup
    ? requests.filter((req) => req.bloodGroup === filterBloodGroup)
    : requests;

  // Client-side 10-item pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-2">
              <Droplet className="w-4 h-4 fill-rose-500" /> Urgent Blood Requests
            </div>
            <h1 className="text-3xl font-extrabold text-white">Pending Donation Requests</h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse current open requests across Bangladesh. Click details to confirm your donation.
            </p>
          </div>

          {/* Filter selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-300">Filter Blood Group:</label>
            <select
              value={filterBloodGroup}
              onChange={(e) => {
                setFilterBloodGroup(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500"
            >
              <option value="">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Request Grid / List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Droplet className="w-10 h-10 text-rose-500 animate-bounce mb-3" />
            <p className="text-xs animate-pulse">Loading active blood requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800 p-8 space-y-3">
            <Droplet className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Pending Requests Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no urgent pending requests matching your selection. Check back soon or create a new request!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-6 rounded-2xl glass-card glass-card-hover border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <BloodGroupBadge bloodGroup={req.bloodGroup} />
                      <StatusBadge status={req.status} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-1">{req.recipientName}</h3>

                    <div className="space-y-2 text-xs text-slate-300 mt-3">
                      <div className="flex items-center gap-2">
                        <Hospital className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{req.hospitalName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          {req.recipientUpazila}, {req.recipientDistrict}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 pt-1 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.donationDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.donationTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      By: {req.requesterName}
                    </span>
                    <button
                      onClick={() => handleViewClick(req._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-950/40 transition"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DonationRequestsPage;
