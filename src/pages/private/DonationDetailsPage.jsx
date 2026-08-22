import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import {
  Droplet,
  MapPin,
  Calendar,
  Clock,
  Hospital,
  User,
  Mail,
  Heart,
  ArrowLeft,
  X,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DonationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/donations/${id}`);
        setRequest(res.data.request);
      } catch (error) {
        console.error('Failed to load donation details:', error);
        toast.error('Donation request not found');
        navigate('/donation-requests');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate]);

  const handleConfirmDonate = async () => {
    setDonating(true);
    try {
      const res = await api.patch(`/donations/${id}/donate`);
      setRequest(res.data.request);
      toast.success('🎉 Thank you! Your blood donation response has been confirmed.');
      setIsDonateModalOpen(false);
    } catch (error) {
      console.error('Confirm donation error:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm donation');
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Droplet className="w-10 h-10 text-rose-500 animate-bounce mb-3" />
          <p className="text-xs animate-pulse">Loading donation request details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/donation-requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Pending Requests
        </Link>

        {/* Details Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <BloodGroupBadge bloodGroup={request.bloodGroup} />
              <div>
                <h1 className="text-2xl font-extrabold text-white">{request.recipientName}</h1>
                <p className="text-xs text-slate-400">Requested by: {request.requesterName}</p>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Medical & Location Info
              </h3>

              <div className="flex items-start gap-3">
                <Hospital className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Hospital Name</p>
                  <p className="text-slate-400">{request.hospitalName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">District & Upazila</p>
                  <p className="text-slate-400">
                    {request.recipientUpazila}, {request.recipientDistrict}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Full Address Line</p>
                  <p className="text-slate-400">{request.fullAddress}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Schedule & Requester Details
              </h3>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Donation Date</p>
                  <p className="text-slate-400">{request.donationDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Donation Time</p>
                  <p className="text-slate-400">{request.donationTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Requester Email</p>
                  <p className="text-slate-400 font-mono">{request.requesterEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Message */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Request Message / Description
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed italic">"{request.requestMessage}"</p>
          </div>

          {/* Donor Info display if status is inprogress or done */}
          {request.donorInfo && request.donorInfo.name && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Committed Donor Assigned
              </p>
              <p className="text-xs text-slate-300">
                Donor Name: <span className="font-bold text-white">{request.donorInfo.name}</span> (
                <span className="font-mono text-slate-400">{request.donorInfo.email}</span>)
              </p>
            </div>
          )}

          {/* Action: Donate Button */}
          {request.status === 'pending' && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsDonateModalOpen(true)}
                className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-rose-950/60 flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <Heart className="w-5 h-5 fill-white" /> Donate Blood Now
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Donate Confirmation Modal */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Confirm Blood Donation</h3>
              </div>
              <button
                onClick={() => setIsDonateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Please review your donor profile details below before confirming your commitment to donate blood for{' '}
              <span className="font-bold text-white">{request.recipientName}</span>.
            </p>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Donor Name (Read Only)</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 font-bold rounded-lg px-3 py-2 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Donor Email (Read Only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-lg px-3 py-2 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDonateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonate}
                disabled={donating}
                className="px-6 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-950/50 transition disabled:opacity-50"
              >
                {donating ? 'Confirming...' : 'Confirm Donation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DonationDetailsPage;
