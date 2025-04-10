const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wardrobuddy-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

// Function to process CSV and update Firestore
async function processCSV(filePath, dataset) {
  const results = [];
  const log = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const item of results) {
        const { sku, name } = item;
        const docId = sku || `${name}-${dataset}`;
        const docRef = db.collection('outfits').doc(docId);

        const doc = await docRef.get();
        if (doc.exists) {
          // Merge fields with existing document
          const existingData = doc.data();
          const updatedData = { ...existingData, ...item, dataset };
          await docRef.set(updatedData, { merge: true });
          log.push({ action: 'updated', id: docId });
        } else {
          // Create new document
          await docRef.set({ ...item, dataset });
          log.push({ action: 'inserted', id: docId });
        }
      }

      // Write log to CSV
      const logFilePath = path.join(__dirname, '../logs', `dataInsertion_${Date.now()}.csv`);
      const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
      logStream.write('action,id\n');
      log.forEach(entry => logStream.write(`${entry.action},${entry.id}\n`));
      logStream.end();
    });
}

// Process each dataset
processCSV('data/Vibrent-Clothes-Rental-Dataset/outfits.csv', 'vibrent');
processCSV('data/nike_data.csv', 'nike');
processCSV('data/apparel_data.csv', 'apparel'); 