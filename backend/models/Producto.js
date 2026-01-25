// src/models/Producto.js
const mongoose = require('mongoose');

// Esquema para las variantes del producto
const varianteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: [45, 'El nombre de la variante no puede exceder 45 caracteres']
  },
  precio: {
    type: Number,
    required: true,
    min: [0, 'El precio debe ser mayor o igual a 0'],
    validate: {
      validator: function(value) {
        // Validar que tenga máximo 10 dígitos y 2 decimales
        const str = value.toString();
        const parts = str.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1] || '';
        
        // Máximo 10 dígitos en total (incluyendo decimales)
        const totalDigits = integerPart.length + decimalPart.length;
        return totalDigits <= 10 && decimalPart.length <= 2;
      },
      message: 'El precio debe tener máximo 10 dígitos y 2 decimales'
    }
  },
  cantidad: {
    type: Number,
    required: true,
    min: [0, 'La cantidad debe ser mayor o igual a 0'],
    max: [1000, 'La cantidad no puede exceder 1000'],
    validate: {
      validator: Number.isInteger,
      message: 'La cantidad debe ser un número entero'
    }
  }
}, {
  _id: false // No crear _id para los subdocumentos
});

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
  },
  variantes: {
    type: [varianteSchema],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'No se pueden tener más de 10 variantes por producto'
    }
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
