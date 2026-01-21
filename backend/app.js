// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializar conexión a MongoDB Atlas
require('./config/database');

const app = express();

app.use(cors());

// Middleware para parsear JSON (para otras rutas que no usan multer)
// Estos middlewares NO interfieren con multipart/form-data cuando multer está en la ruta
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.use('/productos', require('./routes/productos.routes'));

// Middleware para manejar errores de Multer
app.use((error, req, res, next) => {
  if (error instanceof require('multer').MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. Máximo 5MB' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Campo inesperado. Use el campo "imagen"' });
    }
    return res.status(400).json({ 
      message: 'Error al procesar el archivo', 
      error: error.message,
      code: error.code 
    });
  }
  next(error);
});

module.exports = app;
