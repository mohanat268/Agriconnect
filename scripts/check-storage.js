// Check Firebase & MongoDB stored bookings
const fs = require('fs');

console.log('📌 AGRICONTRACT DATA STORAGE ARCHITECTURE:\n');
console.log('1. Primary Real-Time Storage: Firebase Firestore');
console.log('   - Project ID: agriconnect-988bc');
console.log('   - Collection: soil_test_bookings');
console.log('   - Document Fields: bookingId, userId, selectedLab, farmerName, packageType, preferredDate, createdAt\n');
console.log('2. Secondary Full-Stack Backup: MongoDB');
console.log('   - Database: agriconnect');
console.log('   - Collection: soiltestbookings');
console.log('   - Model: SoilTestBooking');
