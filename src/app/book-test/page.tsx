'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  FlaskConical, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle, 
  Clock, 
  Building2,
  Star
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { defaultLabs, DefaultLab } from '@/lib/labsData';

interface FirebaseBooking {
  id?: string;
  bookingId: string;
  userId: string;
  selectedLab: string;
  farmerName: string;
  phone: string;
  farmAddress: string;
  packageType: string;
  preferredDate: string;
  landSizeAcres: number;
  createdAt?: string;
}

export default function BookSoilTestPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);

  const [formData, setFormData] = useState({
    selectedLab: defaultLabs[0].name,
    packageType: 'Advanced AI Bio-Analysis',
    farmerName: '',
    phone: '',
    email: '',
    farmAddress: '',
    landSizeAcres: 5,
    preferredDate: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<FirebaseBooking | null>(null);
  const [bookingsList, setBookingsList] = useState<FirebaseBooking[]>([]);

  // Listen to Auth State and Fetch Real User Bookings from Firebase Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setFormData((prev) => ({
          ...prev,
          farmerName: user.displayName || user.email?.split('@')[0] || prev.farmerName,
          email: user.email || prev.email
        }));
        fetchUserFirebaseBookings(user.uid);
      } else {
        setBookingsList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch strictly the logged-in user's real lab test bookings from Firebase Firestore
  const fetchUserFirebaseBookings = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'soil_test_bookings'),
        where('userId', '==', uid)
      );
      const querySnapshot = await getDocs(q);
      const userBookings: FirebaseBooking[] = [];
      querySnapshot.forEach((doc) => {
        userBookings.push({ id: doc.id, ...doc.data() } as FirebaseBooking);
      });
      // Sort newest first
      userBookings.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setBookingsList(userBookings);
    } catch (err) {
      console.error('Error fetching Firestore bookings for user:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to book a soil test.');
      return;
    }

    if (!formData.farmerName || !formData.phone || !formData.farmAddress || !formData.preferredDate || !formData.selectedLab) {
      alert('Please complete all required fields (Lab, Name, Phone, Address, Preferred Date).');
      return;
    }

    setSubmitting(true);

    const generatedBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBookingData = {
      bookingId: generatedBookingId,
      userId: currentUser.uid,
      userEmail: currentUser.email || '',
      selectedLab: formData.selectedLab,
      farmerName: formData.farmerName,
      phone: formData.phone,
      farmAddress: formData.farmAddress,
      landSizeAcres: Number(formData.landSizeAcres) || 5,
      packageType: formData.packageType,
      preferredDate: formData.preferredDate,
      notes: formData.notes || '',
      createdAt: new Date().toISOString()
    };

    try {
      // Store real booking data in Firebase Firestore
      const docRef = await addDoc(collection(db, 'soil_test_bookings'), newBookingData);
      const createdBooking: FirebaseBooking = { id: docRef.id, ...newBookingData };

      setSuccessBooking(createdBooking);
      fetchUserFirebaseBookings(currentUser.uid);

      // Reset form fields
      setFormData((prev) => ({
        ...prev,
        farmAddress: '',
        notes: '',
        preferredDate: ''
      }));
    } catch (err) {
      console.error('Firebase Firestore save error:', err);
      alert('Failed to save booking to Firebase.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-green-soft border border-agri-green/20 text-xs font-bold text-agri-green-dark mb-2">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Doorstep Sample Collection & Lab Booking</span>
        </div>
        <h1 className="text-2xl font-extrabold text-agri-text-main">
          Book Soil Test Appointment
        </h1>
        <p className="text-xs text-agri-text-subtle max-w-2xl">
          Select your preferred certified soil testing laboratory, package, and schedule doorstep sample collection for your farm.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successBooking && (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-emerald-900 shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-base">Booking Saved to Firebase! #{successBooking.bookingId}</h3>
              <p className="text-xs text-emerald-700">
                Booked at <strong>{successBooking.selectedLab}</strong> for <strong>{successBooking.preferredDate}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessBooking(null)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Multi-Step Booking Form & User's Real Firebase Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-agri-surface-container shadow-card space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: SELECT SOIL TESTING LABORATORY (10 DEFAULT CERTIFIED LABS) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase text-agri-text-subtle tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-agri-green" />
                  <span>1. Select Certified Soil Testing Laboratory (10 Available)</span>
                </label>
                <span className="text-xs font-bold text-agri-green bg-agri-green-soft px-2.5 py-1 rounded-lg">
                  {defaultLabs.length} Labs Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {defaultLabs.map((lab: DefaultLab) => {
                  const isSelected = formData.selectedLab === lab.name;
                  return (
                    <div
                      key={lab.id}
                      onClick={() => setFormData({ ...formData, selectedLab: lab.name })}
                      className={`cursor-pointer p-4 rounded-xl border transition-all relative space-y-1.5 ${
                        isSelected
                          ? 'border-2 border-agri-green bg-agri-green-soft/60 shadow-xs'
                          : 'border-agri-surface-container hover:bg-agri-surface-low'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-xs text-agri-text-main leading-snug flex-1 pr-2">
                          {lab.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{lab.rating}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-agri-text-subtle flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-agri-green flex-shrink-0" />
                        <span className="truncate">{lab.location}</span>
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-agri-surface-container text-[10px]">
                        <span className="font-semibold text-agri-brown-dark">{lab.accredited}</span>
                        <span className="font-bold text-emerald-700">{lab.turnaround}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: SELECT SOIL TESTING PACKAGE */}
            <div className="space-y-3 pt-4 border-t border-agri-surface-container">
              <label className="block text-xs font-extrabold uppercase text-agri-text-subtle tracking-wider">
                2. Select Soil Testing Package
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Basic Nutrient Check',
                    price: '₹499',
                    desc: 'Essential N-P-K & pH levels report.',
                    badge: 'Standard'
                  },
                  {
                    title: 'Advanced AI Bio-Analysis',
                    price: '₹999',
                    desc: 'Full N-P-K, pH, Micronutrients & AI crop insights.',
                    badge: 'Most Popular'
                  },
                  {
                    title: 'Complete Multi-Field Audit',
                    price: '₹1,899',
                    desc: 'Multi-plot GPS mapping, heavy metal scan & agronomist call.',
                    badge: 'Enterprise'
                  }
                ].map((pkg) => {
                  const isSelected = formData.packageType === pkg.title;
                  return (
                    <div
                      key={pkg.title}
                      onClick={() => setFormData({ ...formData, packageType: pkg.title })}
                      className={`cursor-pointer p-4 rounded-xl border transition-all relative ${
                        isSelected
                          ? 'border-2 border-agri-green bg-agri-green-soft shadow-xs'
                          : 'border-agri-surface-container hover:bg-agri-surface-low'
                      }`}
                    >
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agri-brown/10 text-agri-brown-dark">
                        {pkg.badge}
                      </span>
                      <h4 className="font-bold text-sm text-agri-text-main mt-2">{pkg.title}</h4>
                      <div className="text-lg font-black text-agri-green-dark my-1">{pkg.price}</div>
                      <p className="text-[11px] text-agri-text-subtle leading-tight">{pkg.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: FARMER & FARM LOCATION DETAILS */}
            <div className="space-y-4 pt-4 border-t border-agri-surface-container">
              <label className="block text-xs font-extrabold uppercase text-agri-text-subtle tracking-wider">
                3. Farmer & Farm Location Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-agri-text-main mb-1">
                    Farmer Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Full Name"
                      value={formData.farmerName}
                      onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-agri-surface-container rounded-xl bg-agri-surface-low/50 focus:outline-none focus:border-agri-green text-agri-text-main"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-agri-text-main mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-agri-surface-container rounded-xl bg-agri-surface-low/50 focus:outline-none focus:border-agri-green text-agri-text-main"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-agri-text-main mb-1">
                    Farm Survey Address / Village Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-agri-text-subtle" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter Survey No, Landmark, Village, and District"
                      value={formData.farmAddress}
                      onChange={(e) => setFormData({ ...formData, farmAddress: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-agri-surface-container rounded-xl bg-agri-surface-low/50 focus:outline-none focus:border-agri-green text-agri-text-main"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-agri-text-main mb-1">
                    Land Size (Acres)
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={formData.landSizeAcres}
                    onChange={(e) => setFormData({ ...formData, landSizeAcres: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 text-xs border border-agri-surface-container rounded-xl bg-agri-surface-low/50 focus:outline-none focus:border-agri-green text-agri-text-main"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-agri-text-main mb-1">
                    Preferred Collection Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs border border-agri-surface-container rounded-xl bg-agri-surface-low/50 focus:outline-none focus:border-agri-green text-agri-text-main"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Saving Booking to Firebase...</span>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm & Schedule Lab Visit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar: Real User Firebase Lab Test Bookings (No Status Labels) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-agri-surface-container shadow-card space-y-4">
            <h3 className="font-bold text-base text-agri-text-main flex items-center justify-between">
              <span>My Lab Bookings</span>
              <span className="text-xs font-normal text-agri-text-subtle">
                {bookingsList.length} Real Bookings
              </span>
            </h3>

            <div className="space-y-3">
              {bookingsList.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-agri-surface-low border border-agri-surface-container text-xs text-agri-text-subtle space-y-1">
                  <p className="font-bold text-agri-text-main">No lab test bookings found.</p>
                  <p>Book your first test using the form on the left!</p>
                </div>
              ) : (
                bookingsList.map((bk) => (
                  <div
                    key={bk.id || bk.bookingId}
                    className="p-4 rounded-xl border border-agri-surface-container bg-agri-surface-low/40 space-y-2 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-agri-green-dark">{bk.bookingId}</span>
                      <span className="text-[10px] text-agri-text-subtle">
                        {bk.preferredDate}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-agri-text-main flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-agri-green flex-shrink-0" />
                      <span className="truncate">{bk.selectedLab || 'Certified Soil Lab'}</span>
                    </div>

                    <div className="text-xs font-semibold text-agri-text-muted">{bk.farmerName}</div>
                    <div className="text-[11px] text-agri-text-subtle truncate">{bk.packageType}</div>

                    <div className="text-[10px] text-agri-text-subtle flex items-center gap-1 pt-1 border-t border-agri-surface-container">
                      <Clock className="w-3 h-3 text-agri-green" />
                      <span>Collection Date: {bk.preferredDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
