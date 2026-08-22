import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { bdDistricts, getUpazilasForDistrict } from '../../data/bdGeocode';
import { StatusBadge, BloodGroupBadge } from '../../components/ui/Badge';
import { User, Mail, MapPin, Edit3, Save, Upload, Droplet, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    avatar: '',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bloodGroup: user.bloodGroup || '',
        district: user.district || '',
        upazila: user.upazila || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const availableUpazilas = getUpazilasForDistrict(formData.district);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      setFormData({ ...formData, district: value, upazila: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    toast.loading('Uploading new avatar...', { id: 'img' });

    try {
      const imgData = new FormData();
      imgData.append('image', file);
      const imgBbKey = '0c23946d3e34b9d0728c6e2693895e63';
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBbKey}`, imgData);

      if (res.data && res.data.data.url) {
        setFormData({ ...formData, avatar: res.data.data.url });
        toast.success('Avatar uploaded successfully!', { id: 'img' });
      }
    } catch (error) {
      console.error('ImgBB error:', error);
      const fallbackUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatar: fallbackUrl });
      toast.success('Image selected', { id: 'img' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.put('/users/profile', {
        name: formData.name,
        avatar: formData.avatar,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      });

      updateUserProfile(res.data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false); // Reverts back to initial state
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner / Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={formData.avatar || 'https://i.ibb.co/mJR6G1b/avatar-placeholder.png'}
              alt={formData.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-rose-500/30 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2">
              <BloodGroupBadge bloodGroup={formData.bloodGroup} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white">{formData.name}</h1>
              <StatusBadge status={user?.role} />
              {user?.status === 'blocked' && <StatusBadge status="blocked" />}
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-500" /> {formData.email}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> {formData.upazila}, {formData.district}
            </p>
          </div>
        </div>

        {/* Edit Button on Top of the Form */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold animate-pulse">
            Edit Mode Active
          </span>
        )}
      </div>

      {/* Profile Form */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-rose-500" /> Profile Information
          </h3>

          {/* Save Button when in edit mode */}
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saving || uploadingImage}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Updated Data'}
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Email (ALWAYS READ-ONLY EVEN WHEN EDITING) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-rose-400 font-normal flex items-center gap-1">
                <Lock className="w-3 h-3" /> Non-editable
              </span>
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono rounded-xl px-4 py-2.5 outline-none cursor-not-allowed"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
              required
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Avatar Upload in Edit Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Avatar Image</label>
            {isEditing ? (
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 transition">
                <Upload className="w-4 h-4 text-rose-500" />
                <span className="truncate">{uploadingImage ? 'Uploading...' : 'Change Avatar'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            ) : (
              <input
                type="text"
                value={formData.avatar}
                readOnly
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-400 rounded-xl px-4 py-2.5 outline-none cursor-not-allowed truncate"
              />
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
              required
            >
              {bdDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Upazila</label>
            <select
              name="upazila"
              value={formData.upazila}
              onChange={handleChange}
              disabled={!isEditing || !formData.district}
              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-2.5 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
              required
            >
              {availableUpazilas.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </form>

        {isEditing && (
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Reset to saved user info
                setFormData({
                  name: user.name,
                  email: user.email,
                  bloodGroup: user.bloodGroup,
                  district: user.district,
                  upazila: user.upazila,
                  avatar: user.avatar,
                });
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || uploadingImage}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Save Updated Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
