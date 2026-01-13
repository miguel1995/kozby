// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Usar almacenamiento en memoria para multer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Verificar que el campo se llame 'imagen'
    if (!file) {
      return cb(new Error('Campo de archivo requerido. Asegúrate de usar el nombre "imagen"'));
    }
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

module.exports = upload;

