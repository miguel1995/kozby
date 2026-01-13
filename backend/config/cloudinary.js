// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Validar que las variables de entorno estén configuradas
if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ ERROR: Variables de Cloudinary no configuradas');
  console.error('Por favor, agrega estas variables a tu archivo .env:');
  console.error('CLOUDINARY_CLOUD_NAME=tu_cloud_name');
  console.error('CLOUDINARY_API_KEY=tu_api_key');
  console.error('CLOUDINARY_API_SECRET=tu_api_secret');
  console.error('\nObtén estas credenciales desde: https://cloudinary.com/console');
  
  throw new Error('Variables de Cloudinary no configuradas. Revisa tu archivo .env');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

console.log('✅ Cloudinary configurado correctamente');
console.log('Cloud name:', cloudName);

module.exports = cloudinary;

