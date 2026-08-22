import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 shadow-md">
                <Droplet className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Blood<span className="text-rose-500">Life</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering voluntary blood donation across Bangladesh. Connecting heroes with those in need to save lives, every minute of the day.
            </p>
            {/* Social Icons including updated X logo */}
            <div className="flex items-center gap-3 pt-2">
              {/* Updated X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-rose-500/50 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-rose-500/50 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-rose-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/donation-requests" className="hover:text-rose-400 transition">Donation Requests</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-rose-400 transition">Search Donors</Link>
              </li>
              <li>
                <Link to="/funding" className="hover:text-rose-400 transition">Funding & Support</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-rose-400 transition">Register as Donor</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Donor Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Donor Guidelines</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400">Eligibility: Age 18–60, Weight &gt; 50kg</span></li>
              <li><span className="text-slate-400">Interval: Every 90 Days</span></li>
              <li><span className="text-slate-400">Preparation: Drink plenty of water</span></li>
              <li><span className="text-slate-400">Post-donation: Rest for 15 minutes</span></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Emergency Hotline</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+880 1800-BLOOD (25663)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>emergency@bloodlife.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BloodLife Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for lifesaving blood donation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
