import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { bdDistricts, getUpazilasForDistrict } from '../../data/bdGeocode';
import { Droplet, User, Mail, Lock, Image as ImageIcon, UserPlus, ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    avatar: '',
    password: '',
    confirm_password: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const availableUpazilas = getUpazilasForDistrict(formData.district);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      setFormData({ ...formData, district: value, upazila: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ImageBB upload integration option
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    toast.loading('Uploading avatar to ImageBB...', { id: 'img' });

    try {
      const imgData = new FormData();
      imgData.append('image', file);

      // Using free ImgBB API key endpoint or direct client fallback
      const imgBbKey = '0c23946d3e34b9d0728c6e2693895e63';
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBbKey}`, imgData);

      if (res.data && res.data.data.url) {
        setFormData({ ...formData, avatar: res.data.data.url });
        toast.success('Avatar uploaded successfully!', { id: 'img' });
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      // Fallback create object URL
      const fallbackUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatar: fallbackUrl });
      toast.success('Local image preview set', { id: 'img' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.bloodGroup ||
      !formData.district ||
      !formData.upazila ||
      !formData.password
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        avatar: formData.avatar || 'https://i.ibb.co/mJR6G1b/avatar-placeholder.png',
        password: formData.password,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Registration submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-2xl w-full glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Droplet className="w-6 h-6 fill-rose-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Join as a Voluntary Donor</h1>
            <p className="text-xs text-slate-400">
              Create your donor profile. By default, your account role will be set to <span className="text-rose-400 font-bold">Donor</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="donor@example.com"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group *</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition"
                  required
                >
                  <option value="">Select Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar Upload / ImgBB */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image (ImgBB / Upload)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 transition">
                    <Upload className="w-4 h-4 text-rose-500" />
                    <span className="truncate">{uploadingImage ? 'Uploading...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {formData.avatar && (
                    <img
                      src={formData.avatar}
                      alt="Preview"
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-rose-500/40"
                    />
                  )}
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition"
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

              {/* Upazila */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upazila *</label>
                <select
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  disabled={!formData.district}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-40"
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

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Already have a donor account?{' '}
              <Link to="/login" className="text-rose-400 font-bold hover:underline inline-flex items-center gap-0.5">
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
