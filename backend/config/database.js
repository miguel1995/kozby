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
      
      // Procesar la clave privada correctamente
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // Quitar comillas al inicio y final si existen
      privateKey = privateKey.trim();
      if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || 
          (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
        privateKey = privateKey.slice(1, -1);
      }
      
      // Normalizar los saltos de línea - CRITICO para el formato PEM
      // Reemplazar cualquier variación de \n por saltos de línea reales
      privateKey = privateKey.replace(/\\n/g, '\n');
      privateKey = privateKey.replace(/\\\\n/g, '\n');
      privateKey = privateKey.replace(/\\r\\n/g, '\n');
      privateKey = privateKey.replace(/\\r/g, '\n');
      
      // Asegurar que los headers/footers PEM tengan saltos de línea correctos
      privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----[\r\n]*/g, '-----BEGIN PRIVATE KEY-----\n');
      privateKey = privateKey.replace(/[\r\n]*-----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----\n');
      
      // Limpiar saltos de línea múltiples pero mantener estructura PEM
      privateKey = privateKey.replace(/\n{3,}/g, '\n\n');
      
      // Quitar espacios extras al final
      privateKey = privateKey.trim();
      
      // Verificar formato PEM
      if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
        throw new Error('La clave privada no tiene el formato PEM correcto. Debe incluir -----BEGIN PRIVATE KEY----- y -----END PRIVATE KEY-----');
      }
      
      // Verificar que la clave tenga el formato base64 correcto entre los headers
      const keyMatch = privateKey.match(/-----BEGIN PRIVATE KEY-----\n([\s\S]+)\n-----END PRIVATE KEY-----/);
      if (!keyMatch || !keyMatch[1].trim()) {
        throw new Error('La clave privada no contiene datos base64 válidos entre los headers PEM');
      }
      
      // Log de diagnóstico (solo primeros y últimos caracteres por seguridad)
      console.log('🔍 Diagnóstico clave privada:');
      console.log('- Longitud:', privateKey.length);
      console.log('- Empieza con:', privateKey.substring(0, 35));
      console.log('- Termina con:', privateKey.substring(privateKey.length - 35));
      console.log('- Contiene saltos de línea reales:', privateKey.includes('\n'));
      console.log('- Número de líneas:', privateKey.split('\n').length);
      console.log('- Formato PEM válido:', privateKey.match(/-----BEGIN PRIVATE KEY-----\n[\s\S]+\n-----END PRIVATE KEY-----/) !== null);
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
      });
      console.log('✅ Firebase Realtime Database inicializado con variables de entorno');
    }
    // Opción 2: Usar archivo de credenciales de servicio como JSON string
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.log('🔧 Usando FIREBASE_SERVICE_ACCOUNT_KEY...');
      
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        
        // Diagnóstico detallado
        console.log('🔍 Diagnóstico FIREBASE_SERVICE_ACCOUNT_KEY:');
        console.log('- Server time (UTC):', new Date().toISOString());
        console.log('- Project ID:', serviceAccount.project_id);
        console.log('- Private Key ID:', serviceAccount.private_key_id);
        console.log('- Client Email:', serviceAccount.client_email);
        console.log('- Private key length:', serviceAccount.private_key ? serviceAccount.private_key.length : 'NULL');
        console.log('- Private key starts with:', serviceAccount.private_key ? serviceAccount.private_key.substring(0, 30) : 'NULL');
        console.log('- Private key ends with:', serviceAccount.private_key ? serviceAccount.private_key.substring(serviceAccount.private_key.length - 30) : 'NULL');
        console.log('- Private key contains \\n (string):', serviceAccount.private_key ? serviceAccount.private_key.includes('\\n') : false);
        console.log('- Private key contains actual newline:', serviceAccount.private_key ? (serviceAccount.private_key.includes('\n') && !serviceAccount.private_key.includes('\\n')) : false);
        console.log('- Private key lines count:', serviceAccount.private_key ? serviceAccount.private_key.split('\n').length : 0);
        
        // Verificar si la clave privada tiene formato correcto
        if (!serviceAccount.private_key || !serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
          throw new Error('La clave privada en el JSON no tiene el formato correcto');
        }
        
        // Si la clave tiene \n como string literal, corregirla
        if (serviceAccount.private_key.includes('\\n')) {
          console.log('⚠️  Detectado: La clave contiene \\n como string literal, corrigiendo...');
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
        });
        console.log('✅ Firebase Realtime Database inicializado con FIREBASE_SERVICE_ACCOUNT_KEY');
      } catch (parseError) {
        console.error('❌ Error al parsear FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
        throw parseError;
      }
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
