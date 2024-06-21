const admin = require('firebase-admin');
const fs = require('fs');

// Path to your service account key JSON file
const serviceAccount = require('../config/firebase-service-account.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Path to your JSON file
const data = require('./petGroomerData.json'); // Adjust this path as needed

// Define the Firestore collection
const collectionName = 'petGroomer'; // Change this to your collection name

const uploadData = async () => {
  try {
    for (const item of data) {
      // Use the id field from the JSON as the document ID
      await db.collection(collectionName).doc(item.id).set(item);
      console.log(`Document ${item.id} successfully written!`);
    }
    console.log('All data successfully uploaded!');
  } catch (error) {
    console.error('Error writing document: ', error);
  }
};

uploadData();
