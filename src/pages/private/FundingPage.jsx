import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import StripeCheckoutModal from '../../components/ui/StripeCheckoutModal';
import Pagination from '../../components/ui/Pagination';
import { HeartHandshake, DollarSign, Calendar, Lock, User, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FundingPage = () => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFundings = async () => {
    try {
      const res = await api.get('/funding');
      setFundings(res.data.fundings || []);
    } catch (error) {
      console.error('Fetch fundings error:', error);
      toast.error('Failed to load funding records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundings();
  }, []);

  const totalFundCalculated = fundings.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Client-side 10-item pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(fundings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFundings = fundings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Header & Give Fund Button */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <HeartHandshake className="w-4 h-4" /> Community Support Fund
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Funding Ledger</h1>
            <p className="text-xs text-slate-400 mt-1">
              User contributions support emergency blood transport, cold chain storage, and voluntary donor drives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Raised</p>
              <p className="text-xl font-black text-emerald-400">${totalFundCalculated.toLocaleString()}</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" /> Give Fund (Stripe)
            </button>
          </div>
        </div>

        {/* Funding Table */}
        <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              All Funding Contributions ({fundings.length})
            </h3>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> Stripe Payment Gateway Secured
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs animate-pulse">
              Loading funding contributions...
            </div>
          ) : fundings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs space-y-2">
              <HeartHandshake className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="font-semibold text-slate-400">No Contributions Yet</p>
              <p className="text-[11px]">Be the first to give fund for the organization!</p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Contributor Name</th>
                      <th className="px-6 py-4">User Email</th>
                      <th className="px-6 py-4">Fund Amount</th>
                      <th className="px-6 py-4">Funding Date</th>
                      <th className="px-6 py-4">Stripe Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {paginatedFundings.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-900/40 transition">
                        <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xs">
                            {item.userName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          {item.userName}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono">{item.userEmail}</td>
                        <td className="px-6 py-4 font-extrabold text-emerald-400 text-sm">
                          ${item.amount} USD
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                          {item.paymentIntentId || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-800 flex justify-end">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <StripeCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchFundings}
      />

      <Footer />
    </div>
  );
};

export default FundingPage;
