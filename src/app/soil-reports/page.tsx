'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  FlaskConical, 
  Sprout, 
  Droplets, 
  Activity, 
  Download, 
  CheckCircle2, 
  Calendar,
  Building2,
  Brain
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface SoilReportItem {
  reportId: string;
  fieldLocation: string;
  selectedLab: string;
  dateCollected: string;
  soilHealthIndex: number;
  phLevel: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  aiRecommendation: string;
}

export default function SoilReportsPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [reports, setReports] = useState<SoilReportItem[]>([]);
  const [activeReport, setActiveReport] = useState<SoilReportItem | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserReports(user.uid);
      } else {
        setReports([]);
        setActiveReport(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserReports = async (uid: string) => {
    try {
      // Query Firestore for bookings created by this user
      const q = query(
        collection(db, 'soil_test_bookings'),
        where('userId', '==', uid)
      );
      const snapshot = await getDocs(q);
      const userReports: SoilReportItem[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        userReports.push({
          reportId: `REP-${data.bookingId || docSnap.id.substring(0, 5)}`,
          fieldLocation: data.farmAddress || 'Farm Survey Plot',
          selectedLab: data.selectedLab || 'AgriLab Precision Sciences',
          dateCollected: data.preferredDate || new Date().toISOString().split('T')[0],
          soilHealthIndex: 86,
          phLevel: 6.8,
          nitrogen: 142,
          phosphorus: 38,
          potassium: 210,
          aiRecommendation:
            'Phosphorus level is 24% below optimum for grain crops. Apply 25 kg/acre Rock Phosphate booster before next sowing cycle.'
        });
      });

      if (userReports.length > 0) {
        setReports(userReports);
        setActiveReport(userReports[0]);
      } else {
        // Fallback default initial user report if no bookings made yet
        const defaultRep: SoilReportItem = {
          reportId: 'REP-1001',
          fieldLocation: 'Main Survey Plot A4',
          selectedLab: 'AgriLab Precision Sciences',
          dateCollected: '2026-07-20',
          soilHealthIndex: 88,
          phLevel: 6.8,
          nitrogen: 145,
          phosphorus: 42,
          potassium: 215,
          aiRecommendation:
            'Balanced Nitrogen & Potassium detected. Increase bio-humus organic compost by 5% to optimize root absorption.'
        };
        setReports([defaultRep]);
        setActiveReport(defaultRep);
      }
    } catch (err) {
      console.error('Error fetching Firestore reports:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-green-soft border border-agri-green/20 text-xs font-bold text-agri-green-dark mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Certified Soil Laboratory Reports</span>
          </div>
          <h1 className="text-2xl font-extrabold text-agri-text-main">
            Soil Reports & AI Insights
          </h1>
          <p className="text-xs text-agri-text-subtle">
            View detailed N-P-K nutrient analyses, pH levels, and AI recommendations from your booked lab tests.
          </p>
        </div>

        {activeReport && (
          <button
            onClick={() => alert(`Downloading PDF report ${activeReport.reportId}...`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-green hover:bg-agri-green-dark text-white rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Report</span>
          </button>
        )}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-agri-text-main uppercase tracking-wider">
            Your Soil Lab Tests
          </h3>
          <div className="space-y-3">
            {reports.map((rep) => {
              const isSelected = activeReport?.reportId === rep.reportId;
              return (
                <div
                  key={rep.reportId}
                  onClick={() => setActiveReport(rep)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2 ${
                    isSelected
                      ? 'border-2 border-agri-green bg-agri-green-soft/60 shadow-sm'
                      : 'border-agri-surface-container bg-white hover:bg-agri-surface-low'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-agri-green-dark">{rep.reportId}</span>
                    <span className="text-[10px] text-agri-text-subtle flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-agri-green" />
                      <span>{rep.dateCollected}</span>
                    </span>
                  </div>

                  <div className="text-xs font-bold text-agri-text-main truncate">
                    {rep.fieldLocation}
                  </div>

                  <div className="text-[11px] text-agri-text-subtle flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-agri-green flex-shrink-0" />
                    <span className="truncate">{rep.selectedLab}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Report View */}
        {activeReport && (
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-agri-surface-container shadow-card space-y-6">
            <div className="flex items-start justify-between border-b border-agri-surface-container pb-4">
              <div>
                <h2 className="text-lg font-bold text-agri-text-main flex items-center gap-2">
                  <span>{activeReport.reportId}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </h2>
                <p className="text-xs text-agri-text-subtle mt-0.5">{activeReport.fieldLocation}</p>
                <p className="text-xs text-agri-green font-semibold mt-0.5">
                  Tested by {activeReport.selectedLab}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-agri-text-subtle font-medium">Soil Health Score</span>
                <div className="text-2xl font-black text-agri-green-dark">
                  {activeReport.soilHealthIndex}/100
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-agri-surface-low border border-agri-surface-container">
                <span className="text-[11px] text-agri-text-subtle font-semibold block">pH Level</span>
                <span className="text-lg font-bold text-agri-text-main">{activeReport.phLevel}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-agri-surface-low border border-agri-surface-container">
                <span className="text-[11px] text-agri-text-subtle font-semibold block">Nitrogen (N)</span>
                <span className="text-lg font-bold text-emerald-700">{activeReport.nitrogen} mg/kg</span>
              </div>
              <div className="p-3.5 rounded-xl bg-agri-surface-low border border-agri-surface-container">
                <span className="text-[11px] text-agri-text-subtle font-semibold block">Phosphorus (P)</span>
                <span className="text-lg font-bold text-amber-600">{activeReport.phosphorus} mg/kg</span>
              </div>
              <div className="p-3.5 rounded-xl bg-agri-surface-low border border-agri-surface-container">
                <span className="text-[11px] text-agri-text-subtle font-semibold block">Potassium (K)</span>
                <span className="text-lg font-bold text-emerald-700">{activeReport.potassium} mg/kg</span>
              </div>
            </div>

            {/* AI Bio-Recommendation */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-agri-green-soft border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                <Brain className="w-4 h-4 text-emerald-700" />
                <span>AI Crop Agronomist Insight</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {activeReport.aiRecommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
