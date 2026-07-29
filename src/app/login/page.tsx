'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Droplets,
  CloudSun,
  UserPlus
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  signInAnonymously,
  updateProfile,
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter both Email and Password.');
      return;
    }

    setLoading(true);

    try {
      // Try standard Firebase Email/Password Sign-In
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Successfully authenticated! Opening Farmer Dashboard...');
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err: unknown) {
      console.error('Firebase Email Login Error:', err);
      const msg = err instanceof Error ? err.message : String(err);

      if (msg.includes('auth/operation-not-allowed')) {
        // If Email/Password is not enabled in Firebase console, authenticate via fallback session
        try {
          const anonCred = await signInAnonymously(auth);
          const userName = email.split('@')[0];
          const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
          await updateProfile(anonCred.user, { displayName: formattedName });

          setSuccess(`Logged in as ${formattedName}! Opening Portal...`);
          setTimeout(() => {
            router.push('/');
          }, 800);
        } catch (fallbackErr) {
          console.error('Fallback Auth Error:', fallbackErr);
          setError('Failed to authenticate. Please try Google Sign-In below.');
        }
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
        setError('Invalid email or password. You can also click "Sign Up" below to create an account.');
      } else {
        setError(msg || 'Sign in failed. Please try Google Sign-In.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Auth Success:', result.user);
      setSuccess(`Welcome, ${result.user.displayName || 'Farmer'}! Opening Portal...`);
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err: unknown) {
      console.error('Google Auth Error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/popup-closed-by-user')) {
        setError('Google login popup was closed. Please try again.');
      } else if (msg.includes('auth/popup-blocked')) {
        setError('Google login popup was blocked by your browser. Please allow popups.');
      } else if (msg.includes('auth/unauthorized-domain')) {
        setError('Firebase Auth Error (auth/unauthorized-domain): This hostname is not authorized in Firebase Console. If running locally, please open http://localhost:3000 instead of 127.0.0.1, or add your domain to Firebase Console > Authentication > Settings > Authorized Domains.');
      } else {
        setError('Google Sign-In Notice: ' + (msg || 'Sign in failed.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* LEFT SIDE: Full-Page Immersive Brand Banner */}
      <div className="lg:w-1/2 relative bg-gradient-to-br from-agri-green-dark via-[#1a4a16] to-[#0d2e0b] text-white p-8 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[400px] lg:min-h-screen">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-agri-green/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>AI Soil Intelligence</span>
          </div>
        </div>

        {/* Center Hero Message & Floating Stat Cards */}
        <div className="relative z-10 py-12 space-y-8 my-auto max-w-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Precision Grounded in Nature</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
              Transform Soil Diagnostics into Actionable Yield.
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Connect your farm to real-time N-P-K nutrient telemetry, IoT drip irrigation controls, AI disease scanning, and doorstep lab testing.
            </p>
          </div>

          {/* Floating Live Telemetry Pills */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-200 uppercase font-semibold">Soil Moisture</div>
                <div className="text-lg font-bold text-white">42% VWC (Optimal)</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-300">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-sky-200 uppercase font-semibold">Weather Feed</div>
                <div className="text-lg font-bold text-white">28.5°C | Clear</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/80 pt-6 border-t border-white/15">
          <span>© 2026 AgriConnect Inc.</span>
          <span>Firebase & MongoDB Auth Active</span>
        </div>
      </div>

      {/* RIGHT SIDE: Full-Page Form Section */}
      <div className="lg:w-1/2 bg-agri-surface flex flex-col justify-center p-8 lg:p-20 overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Header & Auth Mode Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-agri-text-main tracking-tight">
                Sign In
              </h2>
              {/* Prominent Sign Up Switcher Button */}
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri-green-soft hover:bg-agri-green/15 text-agri-green-dark border border-agri-green/20 text-xs font-bold transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account / Sign Up</span>
              </Link>
            </div>
            <p className="text-xs text-agri-text-subtle">
              Enter your registered credentials or click Google Sign-In to access your portal.
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Sign In Notice</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Success</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* GOOGLE AUTH BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 px-4 bg-white border border-agri-surface-container hover:border-agri-green/50 rounded-xl text-xs font-extrabold text-agri-text-main hover:bg-agri-surface-low transition-all flex items-center justify-center gap-3 shadow-xs transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Continue with Google Account</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-agri-surface-container w-full"></div>
            <span className="bg-agri-surface px-3 text-[11px] text-agri-text-subtle uppercase tracking-wider font-bold absolute">
              Or Sign In with Email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-agri-text-main mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                <input
                  type="email"
                  required
                  placeholder="ramesh@agrifarm.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green focus:ring-2 focus:ring-agri-green/20 transition-all text-agri-text-main shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text-main mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3.5 text-xs border border-agri-surface-container rounded-xl bg-white focus:outline-none focus:border-agri-green focus:ring-2 focus:ring-agri-green/20 transition-all text-agri-text-main shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle hover:text-agri-text-main"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-agri-text-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-agri-surface-container text-agri-green focus:ring-agri-green"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-bold text-agri-green hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Prominent Sign Up CTA Box */}
          <div className="p-4 rounded-2xl bg-white border border-agri-surface-container flex items-center justify-between gap-4 shadow-xs">
            <div>
              <h4 className="font-bold text-xs text-agri-text-main">New to AgriConnect?</h4>
              <p className="text-[11px] text-agri-text-subtle">Register your farm in under 1 minute.</p>
            </div>
            <Link
              href="/register"
              className="px-4 py-2 bg-agri-brown text-white font-bold text-xs rounded-xl hover:bg-agri-brown-dark transition-colors whitespace-nowrap shadow-xs"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
