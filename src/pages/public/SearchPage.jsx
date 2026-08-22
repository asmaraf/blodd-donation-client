import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import { bdDistricts, getUpazilasForDistrict } from '../../data/bdGeocode';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Search, Download, MapPin, Mail, Droplet, UserCheck, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const SearchPage = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [donors, setDonors] = useState(null); // null means search not yet executed
  const [loading, setLoading] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const availableUpazilas = getUpazilasForDistrict(district);

  const handleDistrictChange = (e) => {
    const selectedDist = e.target.value;
    setDistrict(selectedDist);
    setUpazila('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!bloodGroup && !district && !upazila) {
      toast.error('Please select at least one filter criterion (Blood Group or Location)');
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (bloodGroup) queryParams.append('bloodGroup', bloodGroup);
      if (district) queryParams.append('district', district);
      if (upazila) queryParams.append('upazila', upazila);

      const res = await api.get(`/users/search-donors?${queryParams.toString()}`);
      setDonors(res.data.donors || []);
      toast.success(`Found ${res.data.donors?.length || 0} matching donor(s)`);
    } catch (error) {
      console.error('Search donors failed:', error);
      toast.error('Failed to execute donor search.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('search-results-table');
    if (!element) return;

    setExportingPdf(true);
    toast.loading('Generating PDF Report...', { id: 'pdf' });

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`BloodLife_Donor_Search_${bloodGroup || 'All'}_${Date.now()}.pdf`);
      toast.success('PDF report downloaded successfully!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF export.', { id: 'pdf' });
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-3">
            <Search className="w-4 h-4" /> Real-time Donor Discovery
          </div>
          <h1 className="text-3xl font-extrabold text-white">Find Voluntary Blood Donors</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search registered donors by blood group, district, and upazila location across Bangladesh.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl mb-12">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 transition"
              >
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">District</label>
              <select
                value={district}
                onChange={handleDistrictChange}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 transition"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Upazila</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                disabled={!district}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 transition disabled:opacity-40"
              >
                <option value="">Select Upazila</option>
                {availableUpazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search Donors'}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results Display Section */}
        {donors === null ? (
          <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800/80 p-8 max-w-xl mx-auto">
            <Droplet className="w-12 h-12 text-rose-500/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Ready to Search</p>
            <p className="text-xs text-slate-500 mt-1">
              Select your required blood group or district above and click "Search Donors" to view matching profiles.
            </p>
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800 p-8 max-w-xl mx-auto space-y-2">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No Donors Found</p>
            <p className="text-xs text-slate-400">
              No active donors were found matching your criteria. Try widening your search parameters.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Matching Donors ({donors.length})
              </h2>

              {/* PDF Download Button (Bonus Feature) */}
              <button
                onClick={downloadPDF}
                disabled={exportingPdf}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                <Download className="w-4 h-4 text-rose-500" />
                Download PDF Report
              </button>
            </div>

            {/* Results Table & Printable container */}
            <div
              id="search-results-table"
              className="glass-panel border border-slate-800 rounded-2xl overflow-hidden p-4 bg-slate-950"
            >
              <div className="p-4 border-b border-slate-800 mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">BloodLife Voluntary Donor Search Export</h3>
                  <p className="text-[11px] text-slate-400">
                    Query: Group [{bloodGroup || 'Any'}] | Location: [{district || 'All'}, {upazila || 'All'}]
                  </p>
                </div>
                <div className="text-xs text-rose-500 font-extrabold">BloodLife Platform</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Donor Avatar</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Blood Group</th>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Upazila</th>
                      <th className="px-4 py-3">Contact Email</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {donors.map((donor) => (
                      <tr key={donor._id} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3">
                          <img
                            src={donor.avatar || 'https://i.ibb.co/mJR6G1b/avatar-placeholder.png'}
                            alt={donor.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                          />
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-100">{donor.name}</td>
                        <td className="px-4 py-3">
                          <BloodGroupBadge bloodGroup={donor.bloodGroup} />
                        </td>
                        <td className="px-4 py-3">{donor.district}</td>
                        <td className="px-4 py-3">{donor.upazila}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono">{donor.email}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={donor.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
