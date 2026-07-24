'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    districtAddress: '',
    role: 'Farmer',
    primaryCrops: 'Wheat, Corn',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-agri-surface-container' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (pass.length < 10) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });

      setSuccess('Account created! Opening Farmer Dashboard...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: unknown) {
      console.error('Registration Error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/email-already-in-use')) {
        setError('An account with this email address already exists. Please Sign In.');
      } else {
        setError(msg || 'Registration failed. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      setSuccess(`Account registered as ${result.user.displayName}! Opening Portal...`);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: unknown) {
      console.error('Google Auth Registration Error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError('Google Registration Notice: ' + (msg || 'Sign up failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* LEFT SIDE: Full-Page Brand Hero */}
      <div className="lg:w-5/12 relative bg-gradient-to-br from-agri-green-dark via-[#1a4a16] to-[#0d2e0b] text-white p-8 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[400px] lg:min-h-screen">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
              <Sprout className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-white leading-none">
                AgriConnect
              </h1>
              <span className="text-xs text-emerald-200 font-medium tracking-wide">
                Smart Farming Portal
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 py-12 space-y-6 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Join 10,000+ Smart Farmers</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white">
            Start Your Digital Agriculture Journey.
          </h2>

          <ul className="space-y-3.5 text-xs text-emerald-100/90 pt-2">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300">
                <Check className="w-4 h-4" />
              </div>
              <span>Real-time N-P-K soil health tracking</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300">
                <Check className="w-4 h-4" />
              </div>
              <span>AI Crop Disease Diagnosis</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300">
                <Check className="w-4 h-4" />
              </div>
              <span>Doorstep Soil Lab Sample Booking</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-emerald-200/80 pt-6 border-t border-white/15">
          <span>Powered by Firebase & MongoDB Backend</span>
        </div>
      </div>

      {/* RIGHT SIDE: Full-Page Form Section */}
      <div className="lg:w-7/12 bg-agri-surface flex flex-col justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-agri-text-main tracking-tight">
              Create your AgriConnect Account
            </h2>
            <p className="text-xs text-agri-text-subtle">
              Fill in your farm details to start monitoring your field analytics.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Notice</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Account Ready</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-text-main mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                  <input
                    type="text"
                    required
                    placeholder="Ramesh Patel"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green text-agri-text-main shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text-main mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green text-agri-text-main shadow-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-agri-text-main mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                  <input
                    type="email"
                    required
                    placeholder="ramesh@agrifarm.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green text-agri-text-main shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text-main mb-1">
                  Professional Role
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-3 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green text-agri-text-main appearance-none cursor-pointer shadow-xs"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Agronomist">Agronomist Specialist</option>
                    <option value="Lab Partner">Soil Lab Partner</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-agri-text-subtle pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text-main mb-1">
                  Farm District / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                  <input
                    type="text"
                    placeholder="North Sector, Agro Zone"
                    value={formData.districtAddress}
                    onChange={(e) => setFormData({ ...formData, districtAddress: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green text-agri-text-main shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text-main mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green text-agri-text-main shadow-xs"
                  />
                </div>
                {formData.password && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 bg-agri-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] font-semibold text-agri-text-subtle">{strength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text-main mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green text-agri-text-main shadow-xs"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-agri-text-muted pt-1">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="rounded border-agri-surface-container text-agri-green focus:ring-agri-green"
              />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create AgriConnect Account'}</span>
            </button>
          </form>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-3 px-4 bg-white border border-agri-surface-container rounded-xl text-xs font-bold text-agri-text-main hover:bg-agri-surface-low transition-colors flex items-center justify-center gap-3 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Register with Google</span>
          </button>

          <p className="text-center text-xs text-agri-text-subtle pt-2">
            Already have an account?{' '}
            <Link href="/login" className="font-extrabold text-agri-green hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
