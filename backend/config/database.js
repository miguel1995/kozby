// src/config/database.js
const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Opción 1: Usar archivo de credenciales de servicio (recomendado)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
    }
    // Opción 2: Usar ruta a archivo JSON
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
    }
    // Opción 3: Usar credenciales individuales desde variables de entorno
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
      });
    }
    // Opción 4: Inicialización por defecto (para desarrollo local con archivo)
    else {
      // Intenta cargar desde un archivo local si existe (en la raíz de backend)
      try {
        const path = require('path');
        const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
        });
        console.log('✅ Firebase Realtime Database inicializado correctamente');
      } catch (error) {
        console.error('Error: No se encontraron credenciales de Firebase. Por favor configura las variables de entorno o el archivo de credenciales.');
        console.error('Detalles del error:', error.message);
        throw new Error('Firebase no está configurado correctamente');
      }
    }
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
    throw error;
  }
}

// Obtener instancia de Realtime Database
const db = admin.database();

module.exports = db;
