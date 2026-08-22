import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    inprogress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    canceled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blocked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    donor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    volunteer: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const labels = {
    pending: 'Pending',
    inprogress: 'In Progress',
    done: 'Done',
    canceled: 'Canceled',
    active: 'Active',
    blocked: 'Blocked',
    donor: 'Donor',
    volunteer: 'Volunteer',
    admin: 'Admin',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-slate-700 text-slate-300 border-slate-600'
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

export const BloodGroupBadge = ({ bloodGroup }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-sm shadow-rose-900/40">
      🩸 {bloodGroup}
    </span>
  );
};
