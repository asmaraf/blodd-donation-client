import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { bdDistricts, getUpazilasForDistrict } from '../../data/bdGeocode';
import { Edit, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditDonationRequestPage = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/donations/${id}`);
        const req = res.data.request;
        setFormData({
          recipientName: req.recipientName || '',
          recipientDistrict: req.recipientDistrict || '',
          recipientUpazila: req.recipientUpazila || '',
          hospitalName: req.hospitalName || '',
          fullAddress: req.fullAddress || '',
          bloodGroup: req.bloodGroup || '',
          donationDate: req.donationDate || '',
          donationTime: req.donationTime || '',
          requestMessage: req.requestMessage || '',
        });
      } catch (error) {
        console.error('Fetch request edit error:', error);
        toast.error('Failed to load donation request');
        navigate('/dashboard/my-donation-requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, navigate]);

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
    setUpdating(true);

    try {
      await api.put(`/donations/${id}`, formData);
      toast.success('Donation request updated successfully!');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      console.error('Update request error:', error);
      toast.error('Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading request data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Edit className="w-6 h-6 text-rose-500" /> Edit Donation Request
        </h1>
        <p className="text-xs text-slate-400 mt-1">Update recipient details and location info.</p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
              <select
                name="recipientDistrict"
                value={formData.recipientDistrict}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              >
                {bdDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Upazila</label>
              <select
                name="recipientUpazila"
                value={formData.recipientUpazila}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              >
                {availableUpazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Address Line</label>
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Donation Date</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Donation Time</label>
              <input
                type="time"
                name="donationTime"
                value={formData.donationTime}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Request Message</label>
            <textarea
              rows="4"
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-donation-requests')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              <Save className="w-4 h-4 inline mr-1" />
              {updating ? 'Updating...' : 'Update Donation Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationRequestPage;
