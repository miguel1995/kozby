// src/config/database.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Opción 1: Usar archivo JSON local (PRIORIDAD - para desarrollo)
    try {
      const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
      
      // Usar fs.readFileSync en lugar de require() para evitar problemas de caché
      const serviceAccountRaw = fs.readFileSync(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountRaw);
      
      // Logs de diagnóstico para verificar la clave privada y tiempo del servidor
      console.log('🔍 DIAGNÓSTICO - Verificando clave privada:');
      console.log('Server time (UTC):', new Date().toISOString());
      console.log('Server time (local):', new Date().toString());
      console.log('Private key ID:', serviceAccount.private_key_id);
      console.log('Private key length:', serviceAccount.private_key ? serviceAccount.private_key.length : 'NULL');
      console.log('Private key starts with:', serviceAccount.private_key ? serviceAccount.private_key.substring(0, 50) : 'NULL');
      console.log('Private key contains \\n (string):', serviceAccount.private_key ? serviceAccount.private_key.includes('\\n') : false);
      console.log('Private key contains actual newline:', serviceAccount.private_key ? serviceAccount.private_key.includes('\n') && !serviceAccount.private_key.includes('\\n') : false);
      console.log('Private key ends with:', serviceAccount.private_key ? serviceAccount.private_key.substring(serviceAccount.private_key.length - 50) : 'NULL');
      
      // Verificar si la clave privada tiene el formato correcto
      if (!serviceAccount.private_key || !serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
        throw new Error('La clave privada no tiene el formato correcto');
      }
      
      // Intentar corregir los saltos de línea si es necesario
      if (serviceAccount.private_key && serviceAccount.private_key.includes('\\n')) {
        console.log('⚠️  Detectado: La clave contiene \\n como string literal, corrigiendo...');
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      
      // Crear una copia del objeto para evitar modificar el original
      const serviceAccountCopy = {
        type: serviceAccount.type,
        project_id: serviceAccount.project_id,
        private_key_id: serviceAccount.private_key_id,
        private_key: serviceAccount.private_key,
        client_email: serviceAccount.client_email,
        client_id: serviceAccount.client_id,
        auth_uri: serviceAccount.auth_uri,
        token_uri: serviceAccount.token_uri,
        auth_provider_x509_cert_url: serviceAccount.auth_provider_x509_cert_url,
        client_x509_cert_url: serviceAccount.client_x509_cert_url,
        universe_domain: serviceAccount.universe_domain
      };
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountCopy),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
      console.log('✅ Firebase Realtime Database inicializado con archivo JSON local');
    } catch (fileError) {
      // Si no se encuentra el archivo, intentar con variables de entorno
      
      // Opción 2: Usar ruta a archivo JSON desde variable de entorno
      if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
        });
        console.log('✅ Firebase Realtime Database inicializado con archivo de ruta');
      }
      // Opción 3: Usar archivo de credenciales de servicio como JSON string
      else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
        });
        console.log('✅ Firebase Realtime Database inicializado con FIREBASE_SERVICE_ACCOUNT_KEY');
      }
      // Opción 4: Usar credenciales individuales desde variables de entorno
      else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
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
      // Si no hay credenciales configuradas, lanzar error
      else {
        console.error('Error: No se encontraron credenciales de Firebase.');
        console.error('Por favor coloca el archivo firebase-service-account.json en la raíz de la carpeta backend');
        console.error('O configura las variables de entorno necesarias.');
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
