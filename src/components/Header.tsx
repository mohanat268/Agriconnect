'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  CloudSun, 
  MapPin, 
  ChevronDown,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchLiveWeather, LiveWeatherData } from '@/lib/weather';

export default function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch real live weather and GPS/IP location
  useEffect(() => {
    fetchLiveWeather().then((data) => {
      setWeather(data);
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setDropdownOpen(false);
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Farmer User';
  const displayEmail = currentUser?.email || 'Authenticated User';
  const photoURL = currentUser?.photoURL;

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-agri-surface-container px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
          <input
            type="text"
            placeholder="Search soil records, crop advice, or guides..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-agri-surface-low border border-agri-surface-container rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green text-agri-text-main placeholder:text-agri-text-subtle transition-all"
          />
        </div>
      </div>

      {/* Weather, Location & Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Real Live GPS / IP Location Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-agri-surface-low border border-agri-surface-container rounded-xl text-xs font-semibold text-agri-text-main">
          <MapPin className="w-3.5 h-3.5 text-agri-green flex-shrink-0" />
          <span className="truncate max-w-[150px]">
            {weather ? weather.locationName : 'Detecting location...'}
          </span>
        </div>

        {/* Real Live Weather Widget */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900 font-semibold">
          <CloudSun className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>{weather ? `${weather.temperature}°C` : '--°C'}</span>
          <span className="text-sky-300">|</span>
          <span className="truncate max-w-[120px]">
            {weather ? weather.weatherCondition : 'Loading...'}
          </span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-agri-text-muted hover:bg-agri-surface-low hover:text-agri-text-main transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* CLICKABLE PROFILE FEATURE DROPDOWN */}
        <div className="relative pl-3 border-l border-agri-surface-container" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-agri-surface-low transition-all cursor-pointer group"
          >
            {photoURL ? (
              /* eslint-disable-next-html-element-suppression */
              <img
                src={photoURL}
                alt={displayName}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-agri-green/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-agri-green-soft border border-agri-green/30 flex items-center justify-center text-agri-green-dark font-black text-sm shadow-xs group-hover:bg-agri-green group-hover:text-white transition-colors">
                {displayName[0]?.toUpperCase()}
              </div>
            )}

            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-agri-text-main truncate max-w-[130px]">
                {displayName}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active Account</span>
              </div>
            </div>

            <ChevronDown className={`w-4 h-4 text-agri-text-subtle transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-agri-green' : ''}`} />
          </button>

          {/* DROPDOWN MENU */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-agri-surface-container shadow-elevated py-2 z-50 animate-in fade-in zoom-in-95">
              {/* User Summary Header */}
              <div className="px-4 py-3 border-b border-agri-surface-container bg-agri-surface-low/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-agri-green text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {displayName[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-agri-text-main truncate">{displayName}</p>
                    <p className="text-[11px] text-agri-text-subtle truncate">{displayEmail}</p>
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Authenticated Farmer</span>
                </div>
              </div>

              {/* LOGOUT BUTTON INSIDE DROPDOWN */}
              <div className="p-1.5">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Log Out of AgriConnect</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
