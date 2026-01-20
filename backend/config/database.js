// src/config/database.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Opción 1: Usar credenciales individuales desde variables de entorno (PRIORIDAD - para producción)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('🔧 Usando variables de entorno para Firebase...');
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
      console.log('🔧 Usando FIREBASE_SERVICE_ACCOUNT_KEY...');
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
      console.log('✅ Firebase Realtime Database inicializado con FIREBASE_SERVICE_ACCOUNT_KEY');
    }
    // Opción 3: Usar ruta a archivo JSON desde variable de entorno
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      console.log('🔧 Usando archivo de ruta desde variable de entorno...');
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
      console.log('✅ Firebase Realtime Database inicializado con archivo de ruta');
    }
    // Opción 4: Usar archivo JSON local (solo para desarrollo local)
    else {
      try {
        const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
        
        // Usar fs.readFileSync en lugar de require() para evitar problemas de caché
        const serviceAccountRaw = fs.readFileSync(serviceAccountPath, 'utf8');
        const serviceAccount = JSON.parse(serviceAccountRaw);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
        });
        console.log('✅ Firebase Realtime Database inicializado con archivo JSON local');
      } catch (fileError) {
        console.error('Error: No se encontraron credenciales de Firebase.');
        console.error('Para desarrollo local: coloca el archivo firebase-service-account.json en la raíz de la carpeta backend');
        console.error('Para producción: configura las variables de entorno necesarias.');
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
