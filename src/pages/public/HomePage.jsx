import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  Droplet,
  Search,
  UserPlus,
  Heart,
  ShieldCheck,
  Clock,
  MapPin,
  Send,
  Phone,
  Mail,
  Award,
  Users,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to our blood support team.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-6 animate-pulse">
            <Droplet className="w-4 h-4 fill-rose-500" />
            Connecting Lifesavers Across Bangladesh
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Donate Blood, <span className="gradient-text">Save Lives</span> in Every Emergency
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Our intelligent blood platform connects urgent recipient requests directly with nearby registered donors. Fast, seamless, and transparent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-base rounded-2xl shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5" />
              Join as a donor
            </Link>

            <Link
              to="/search"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-base rounded-2xl border border-slate-700/80 shadow-lg flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5 text-rose-500" />
              Search Donors
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 p-6 rounded-3xl glass-panel border border-slate-800">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">12,400+</p>
              <p className="text-xs text-slate-400 font-medium">Registered Donors</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-400">8,950+</p>
              <p className="text-xs text-slate-400 font-medium">Lives Touched</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">64</p>
              <p className="text-xs text-slate-400 font-medium">Districts Covered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">15 Min</p>
              <p className="text-xs text-slate-400 font-medium">Avg Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section: How It Works & Blood Compatibility */}
      <section className="py-20 bg-slate-950 relative border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How BloodLife Works</h2>
            <p className="text-sm text-slate-400">
              Four streamlined steps to ensure safe, rapid blood request dispatch and voluntary donor matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Register Account',
                desc: 'Sign up as a donor with your blood group, district, and upazila location.',
                icon: UserPlus,
                color: 'text-rose-500',
              },
              {
                step: '02',
                title: 'Post Request',
                desc: 'Patients or relatives post blood donation requests with hospital details.',
                icon: Droplet,
                color: 'text-rose-400',
              },
              {
                step: '03',
                title: 'Donor Match',
                desc: 'Verified donors respond to pending requests and commit to donate.',
                icon: CheckCircle2,
                color: 'text-emerald-400',
              },
              {
                step: '04',
                title: 'Save Lives',
                desc: 'Blood is donated at the medical center, updating status to done.',
                icon: Heart,
                color: 'text-rose-500',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl glass-card glass-card-hover relative space-y-3"
              >
                <span className="text-3xl font-black text-slate-800">{item.step}</span>
                <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 w-fit ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section: Why Donate Blood */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Why Voluntary Donation Matters
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                One Single Bag of Blood Can Save Up to <span className="gradient-text">Three Lives</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                In Bangladesh, thousands of emergency surgeries, accident recoveries, and thalassemia patients require immediate blood transfusion every single day. By being a registered donor, you ensure zero delay in emergency care.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Helps lower risk of cardiovascular & heart diseases for donors',
                  'Free health screening during every blood donation session',
                  'Instant push notifications when someone in your district needs blood',
                  'Full confidentiality and verified requester credentials',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-200">
                    <div className="p-1 rounded-full bg-rose-500/20 text-rose-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/donation-requests"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  View Active Requests
                </Link>
              </div>
            </div>

            {/* Visual Card Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
                <Award className="w-8 h-8 text-amber-400" />
                <h4 className="text-base font-bold text-white">Hero Recognition</h4>
                <p className="text-xs text-slate-400">Earn donor badges and contribution records on your profile.</p>
              </div>
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2 translate-y-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Verified Requests</h4>
                <p className="text-xs text-slate-400">All request listings are moderated for safety & authenticity.</p>
              </div>
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
                <Clock className="w-8 h-8 text-blue-400" />
                <h4 className="text-base font-bold text-white">24/7 Availability</h4>
                <p className="text-xs text-slate-400">Search for donors at any hour of the day or night.</p>
              </div>
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2 translate-y-4">
                <MapPin className="w-8 h-8 text-rose-500" />
                <h4 className="text-base font-bold text-white">Geocode Filter</h4>
                <p className="text-xs text-slate-400">Filter donors by 64 districts and upazila regions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  Contact Us
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-4">
                  Need Help or Have Questions?
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Our emergency coordination center is available around the clock to assist with blood donation requests or donor inquiries.
                </p>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-rose-500 border border-slate-800">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Emergency Hotline</p>
                      <p className="text-sm font-bold text-white">+880 1800-BLOOD (25663)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-rose-500 border border-slate-800">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Email Support</p>
                      <p className="text-sm font-bold text-white">support@bloodlife.org</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Inquiry</label>
                  <textarea
                    rows="3"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can we assist you?"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
