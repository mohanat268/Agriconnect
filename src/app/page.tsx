'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Droplets,
  Sun,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  MapPin
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchLiveWeather, LiveWeatherData } from '@/lib/weather';

interface Telemetry {
  fieldId: string;
  farmName: string;
  soilMoisture: number;
  soilHealthScore: number;
  temperature: number;
  humidity: number;
  weatherCondition: string;
  forecastRainChance: number;
  npkRatio: { n: number; p: number; k: number };
  pH: number;
}

interface Alert {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);

  const [telemetry, setTelemetry] = useState<Telemetry>({
    fieldId: 'Agri-Sector-04',
    farmName: 'Field Plot A4',
    soilMoisture: 42,
    soilHealthScore: 88,
    temperature: 28,
    humidity: 65,
    weatherCondition: 'Partly Cloudy',
    forecastRainChance: 15,
    npkRatio: { n: 142, p: 38, k: 210 },
    pH: 6.8
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'ALT-1',
      type: 'warning',
      title: 'Phosphorus Deficit Detected',
      message: 'Plot A4 exhibits 38 mg/kg P levels. Apply Rock Phosphate booster within 7 days.',
      timestamp: '2 hours ago'
    },
    {
      id: 'ALT-2',
      type: 'info',
      title: 'Optimal Irrigation Window',
      message: 'Soil moisture is 42%. Scheduled drip cycle at 06:00 AM tomorrow.',
      timestamp: '5 hours ago'
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch real live weather and GPS location
  useEffect(() => {
    fetchLiveWeather().then((liveData) => {
      setWeather(liveData);
      setTelemetry((prev) => ({
        ...prev,
        temperature: liveData.temperature,
        humidity: liveData.humidity,
        weatherCondition: liveData.weatherCondition,
        forecastRainChance: liveData.rainChance
      }));
    });
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success && data.telemetry) {
          setTelemetry((prev) => ({
            ...prev,
            ...data.telemetry,
            temperature: weather?.temperature || data.telemetry.temperature,
            weatherCondition: weather?.weatherCondition || data.telemetry.weatherCondition
          }));
          if (data.alerts?.length) setAlerts(data.alerts);
        }
      } catch (err) {
        console.error('Telemetry fetch error:', err);
      }
    }
    loadData();
  }, [weather]);

  const farmerName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Farmer User';
  const locationLabel = weather?.locationName || 'Detecting Field GPS Location...';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Banner / Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-agri-green-dark via-agri-green to-emerald-800 p-8 text-white shadow-elevated">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-agri-green-bg">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location: {locationLabel}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {farmerName}!
            </h2>
            <p className="text-agri-green-bg/90 text-sm leading-relaxed">
              Live GPS location detected at <span className="font-bold text-white">{locationLabel}</span>. Soil health index is <span className="text-emerald-300 font-bold">{telemetry.soilHealthScore}/100</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/book-test"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-agri-brown-light hover:bg-amber-300 text-agri-brown-dark font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Book Soil Test</span>
            </Link>
            <Link
              href="/soil-reports"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold text-sm transition-all"
            >
              <span>View AI Insights</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Soil Health Score */}
        <div className="bg-white p-5 rounded-2xl border border-agri-surface-container shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-agri-text-subtle uppercase tracking-wider">
              Soil Health Index
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-agri-text-main">
              {telemetry.soilHealthScore}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Optimal Grade A
            </span>
          </div>
          <div className="w-full bg-agri-surface-low h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${telemetry.soilHealthScore}%` }}
            ></div>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white p-5 rounded-2xl border border-agri-surface-container shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-agri-text-subtle uppercase tracking-wider">
              Soil Moisture
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-agri-text-main">
              {telemetry.soilMoisture}%
            </span>
            <span className="text-xs font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
              Balanced Level
            </span>
          </div>
          <p className="text-xs text-agri-text-subtle mt-3">
            Volumetric Water Content (VWC) at 15cm depth
          </p>
        </div>

        {/* Real Live Weather Feed */}
        <div className="bg-white p-5 rounded-2xl border border-agri-surface-container shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-agri-text-subtle uppercase tracking-wider">
              Real Live Weather
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-agri-text-main">
              {weather ? `${weather.temperature}°C` : `${telemetry.temperature}°C`}
            </span>
            <span className="text-xs font-semibold text-agri-text-subtle truncate max-w-[110px]">
              {weather?.weatherCondition || telemetry.weatherCondition}
            </span>
          </div>
          <p className="text-xs text-agri-text-subtle mt-3 truncate">
            Humidity: {weather?.humidity || telemetry.humidity}% | Rain chance: {weather?.rainChance || telemetry.forecastRainChance}%
          </p>
        </div>

        {/* pH Balance */}
        <div className="bg-white p-5 rounded-2xl border border-agri-surface-container shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-agri-text-subtle uppercase tracking-wider">
              pH Acidity Level
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-agri-text-main">
              {telemetry.pH}
            </span>
            <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              Slightly Alkaline
            </span>
          </div>
          <p className="text-xs text-agri-text-subtle mt-3">
            Target range for Wheat: 6.5 - 7.2
          </p>
        </div>
      </div>

      {/* Main Section: N-P-K Breakdown & Field Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* N-P-K Nutrient Analysis */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-agri-surface-container shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-agri-text-main">Soil N-P-K Nutrient Status</h3>
              <p className="text-xs text-agri-text-subtle">Lab telemetry values measured in mg/kg</p>
            </div>
            <Link
              href="/soil-reports"
              className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
            >
              <span>Full Soil Lab Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Nitrogen */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-agri-text-main">Nitrogen (N) - Leaf & Stem Growth</span>
                <span className="text-emerald-700 font-bold">{telemetry.npkRatio.n} mg/kg (Optimal)</span>
              </div>
              <div className="w-full bg-agri-surface-low h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-agri-text-main">Phosphorus (P) - Root & Seed Development</span>
                <span className="text-amber-600 font-bold">{telemetry.npkRatio.p} mg/kg (Deficient)</span>
              </div>
              <div className="w-full bg-agri-surface-low h-3 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* Potassium */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-agri-text-main">Potassium (K) - Disease & Water Stress Immunity</span>
                <span className="text-emerald-700 font-bold">{telemetry.npkRatio.k} mg/kg (Optimal)</span>
              </div>
              <div className="w-full bg-agri-surface-low h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-agri-brown-soft/60 border border-agri-brown-light/40 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-agri-brown-dark flex-shrink-0 mt-0.5" />
            <div className="text-xs text-agri-brown-dark space-y-1">
              <span className="font-bold block">AI Recommendation Notice:</span>
              <p>
                Phosphorus (P) is 24% below the required threshold for the upcoming sowing season. Apply Rock Phosphate booster within 7 days.
              </p>
            </div>
          </div>
        </div>

        {/* Active Field Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Field Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-agri-surface-container shadow-card space-y-4">
            <h3 className="font-bold text-base text-agri-text-main flex items-center justify-between">
              <span>Active Field Alerts</span>
              <span className="text-xs font-normal text-agri-text-subtle">{alerts.length} Active</span>
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl border border-agri-surface-container bg-agri-surface-low/50 hover:bg-white transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-agri-text-main">{alert.title}</span>
                    <span className="text-[10px] text-agri-text-subtle">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-agri-text-muted leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
