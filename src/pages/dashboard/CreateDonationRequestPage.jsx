import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { bdDistricts, getUpazilasForDistrict } from '../../data/bdGeocode';
import { PlusCircle, AlertOctagon, User, Mail, Hospital, MapPin, Calendar, Clock, FileText, Droplet } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateDonationRequestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: '',
  });

  const [loading, setLoading] = useState(false);

  const isBlocked = user?.status === 'blocked';
  const availableUpazilas = getUpazilasForDistrict(formData.recipientDistrict);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'recipientDistrict') {
      setFormData({ ...formData, recipientDistrict: value, recipientUpazila: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error('Your account is blocked. Blocked users cannot create donation requests.');
      return;
    }

    if (
      !formData.recipientName ||
      !formData.recipientDistrict ||
      !formData.recipientUpazila ||
      !formData.hospitalName ||
      !formData.fullAddress ||
      !formData.bloodGroup ||
      !formData.donationDate ||
      !formData.donationTime ||
      !formData.requestMessage
    ) {
      toast.error('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/donations', formData);
      toast.success('Donation request created successfully!');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      console.error('Create request error:', error);
      toast.error(error.response?.data?.message || 'Failed to create donation request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-rose-500" /> Create Blood Donation Request
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Post an urgent blood requirement for a recipient in need.
        </p>
      </div>

      {/* Blocked User Warning Alert */}
      {isBlocked && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3">
          <AlertOctagon className="w-6 h-6 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-sm">Account Blocked</p>
            <p>Your donor account is currently suspended by administration. Blocked users are restricted from submitting new donation requests.</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read Only Requester Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Requester Name (Read-only)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold rounded-xl pl-9 pr-3 py-2 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Requester Email (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono rounded-xl pl-9 pr-3 py-2 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Recipient Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Name *</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Name of person needing blood"
                disabled={isBlocked}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group Required *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={isBlocked}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              >
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient District */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient District *</label>
              <select
                name="recipientDistrict"
                value={formData.recipientDistrict}
                onChange={handleChange}
                disabled={isBlocked}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              >
                <option value="">Select District</option>
                {bdDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Upazila */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Upazila *</label>
              <select
                name="recipientUpazila"
                value={formData.recipientUpazila}
                onChange={handleChange}
                disabled={isBlocked || !formData.recipientDistrict}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              >
                <option value="">Select Upazila</option>
                {availableUpazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital Name *</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="e.g. Dhaka Medical College Hospital"
                disabled={isBlocked}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Address Line *</label>
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="e.g. Zahir Raihan Rd, Dhaka"
                disabled={isBlocked}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              />
            </div>

            {/* Donation Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Donation Date *</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                disabled={isBlocked}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              />
            </div>

            {/* Donation Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Donation Time *</label>
              <input
                type="time"
                name="donationTime"
                value={formData.donationTime}
                onChange={handleChange}
                disabled={isBlocked}
                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
                required
              />
            </div>
          </div>

          {/* Request Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Request Message *</label>
            <textarea
              rows="4"
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              placeholder="Explain in detail why blood is needed, medical condition, contact urgency..."
              disabled={isBlocked}
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-50"
              required
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading || isBlocked}
              className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-rose-950/60 flex items-center gap-2 transition disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Creating Request...' : 'Submit Donation Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequestPage;
