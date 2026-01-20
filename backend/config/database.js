// src/config/database.js
const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Opción 1: Usar credenciales individuales desde variables de entorno (PRIORIDAD)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
      });
      console.log('✅ Firebase Realtime Database inicializado con variables de entorno');
    }
    // Opción 2: Usar archivo de credenciales de servicio como JSON string
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
      console.log('✅ Firebase Realtime Database inicializado con FIREBASE_SERVICE_ACCOUNT_KEY');
    }
    // Opción 3: Usar ruta a archivo JSON (solo para desarrollo local si es necesario)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
      console.log('✅ Firebase Realtime Database inicializado con archivo de ruta');
    }
    // Si no hay credenciales configuradas, lanzar error
    else {
      console.error('Error: No se encontraron credenciales de Firebase.');
      console.error('Por favor configura las siguientes variables de entorno:');
      console.error('  - FIREBASE_PROJECT_ID');
      console.error('  - FIREBASE_PRIVATE_KEY');
      console.error('  - FIREBASE_CLIENT_EMAIL');
      console.error('  - FIREBASE_DATABASE_URL (opcional)');
      throw new Error('Firebase no está configurado correctamente');
    }
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
    throw error;
  }
}

// Obtener instancia de Realtime Database
const db = admin.database();

module.exports = db;
