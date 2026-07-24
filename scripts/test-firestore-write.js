const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCGLNgUjcUn9qcvGugcjmbT80zLZX97XNc",
  authDomain: "agriconnect-988bc.firebaseapp.com",
  projectId: "agriconnect-988bc",
  storageBucket: "agriconnect-988bc.firebasestorage.app",
  messagingSenderId: "401557244672",
  appId: "1:401557244672:web:ee5d7f30299130065741e5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWrite() {
  console.log('🔥 Testing Firebase Firestore Write to agriconnect-988bc...');
  try {
    const docRef = await addDoc(collection(db, 'soil_test_bookings'), {
      bookingId: 'TEST-FIRESTORE-CHECK',
      selectedLab: 'National Agro-Soil Testing Institute',
      farmerName: 'Firebase Verification Test',
      packageType: 'Advanced AI Bio-Analysis',
      preferredDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      testNote: 'Direct verification from script'
    });
    console.log('✅ SUCCESS! Document written to Firestore with ID:', docRef.id);

    console.log('\n📖 Fetching documents from collection "soil_test_bookings"...');
    const snapshot = await getDocs(collection(db, 'soil_test_bookings'));
    console.log(`📊 Found ${snapshot.size} document(s) in "soil_test_bookings":`);
    snapshot.forEach(doc => {
      console.log(' - Doc ID:', doc.id, 'Data:', JSON.stringify(doc.data()));
    });
  } catch (err) {
    console.error('❌ FIRESTORE ERROR:', err.message);
    console.error('   Full Error:', err);
  }
}

testWrite();
