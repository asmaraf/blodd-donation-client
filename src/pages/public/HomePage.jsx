import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SplineHero3D from '../../components/ui/SplineHero3D';
import api from '../../utils/api';
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
  const [totalFunding, setTotalFunding] = useState(0);

  // GSAP Animation Refs
  const orbRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const paraRef = useRef(null);
  const ctaRef = useRef(null);
  const splineRef = useRef(null);
  const metricsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating glowing orb continuous animation
      gsap.to(orbRef.current, {
        y: 30,
        x: 15,
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: 'sine.inOut',
      });

      // Master entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, {
        y: -30,
        opacity: 0,
        scale: 0.85,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
        .from(
          titleRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 1,
          },
          '-=0.4'
        )
        .from(
          paraRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .from(
          ctaRef.current ? ctaRef.current.children : [],
          {
            y: 30,
            opacity: 0,
            scale: 0.95,
            stagger: 0.2,
            duration: 0.8,
            ease: 'back.out(1.5)',
          },
          '-=0.5'
        )
        .from(
          splineRef.current,
          {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.6'
        )
        .from(
          metricsRef.current ? metricsRef.current.children : [],
          {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
          },
          '-=0.4'
        );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/stats/public-summary');
        if (res.data && typeof res.data.totalFunding === 'number') {
          setTotalFunding(res.data.totalFunding);
        }
      } catch (err) {
        console.error('Failed to load total funding summary', err);
      }
    };
    fetchSummary();
  }, []);

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

      {/* Hero Banner Section with GSAP Animations & Spline 3D Scene */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        <div
          ref={orbRef}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/20 blur-3xl rounded-full pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-6"
              >
                <Droplet className="w-4 h-4 fill-rose-500" />
                Connecting Lifesavers Across Bangladesh
              </div>

              <h1
                ref={titleRef}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6"
              >
                Donate Blood, <span className="gradient-text">Save Lives</span> in Every Emergency
              </h1>

              <p
                ref={paraRef}
                className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0"
              >
                Our intelligent blood platform connects urgent recipient requests directly with nearby registered donors. Fast, seamless, and transparent.
              </p>

              <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-base rounded-2xl shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-5 h-5 text-white" />
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
            </div>

            {/* Right Spline 3D Scene Column */}
            <div ref={splineRef} className="lg:col-span-5">
              <SplineHero3D />
            </div>
          </div>

          {/* Quick Metrics Bar with GSAP Stagger */}
          <div
            ref={metricsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-16 p-6 rounded-3xl glass-panel border border-slate-800"
          >
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
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">
                ${totalFunding.toLocaleString()} USD
              </p>
              <p className="text-xs text-slate-400 font-medium">Total Donation Fund</p>
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
                <span className="text-4xl font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight block">{item.step}</span>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold">
                <Heart className="w-4 h-4 fill-rose-500" /> Save Lives Today
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Why Voluntary Blood Donation Matters
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                A single blood donation can save up to three lives in emergency surgeries, trauma care, thalassemias, and maternal health complications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <Clock className="w-5 h-5 text-rose-400" />
                  <h4 className="text-sm font-bold text-slate-100">Every 2 Seconds</h4>
                  <p className="text-xs text-slate-400">Someone in Bangladesh requires emergency blood transfusion.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-100">100% Voluntary</h4>
                  <p className="text-xs text-slate-400">Free, transparent, and direct donor-to-patient matching.</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-500" /> Donors Blood Group Compatibility
              </h3>
              <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
                {['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'].map((type) => (
                  <div key={type} className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition">
                    <span className="text-rose-400 font-extrabold text-sm block">{type}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Compatible</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-3">
                <Phone className="w-4 h-4" /> Reach Out
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4">Contact BloodLife Support</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Have questions about registering, blood request posting, or platform volunteering? Our support team is available 24/7.
              </p>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-100">Emergency Helpline</p>
                    <p className="text-slate-400">+880 1700-000000</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-100">Email Support</p>
                    <p className="text-slate-400">support@bloodlife.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-100">Headquarters</p>
                    <p className="text-slate-400">Dhanmondi, Dhaka - 1209, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl glass-panel border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">Send Us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-3 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-3 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-xs text-slate-100 rounded-xl px-4 py-3 outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition"
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
