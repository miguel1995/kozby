// src/models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
  descripcion: {
    type: String,
    default: null,
    trim: true
  },
  imagen: {
    type: String,
    default: null
  },
  categoria_id: {
    type: String,
    required: true
  },
  archivado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Automáticamente crea createdAt y updatedAt
  versionKey: false // Elimina el campo __v
});

// Índices para mejor rendimiento
productoSchema.index({ archivado: 1 });
productoSchema.index({ categoria_id: 1 });

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
