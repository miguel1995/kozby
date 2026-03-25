const mongoose = require('mongoose');

const descuentoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    tipo: { type: String, required: true },
    monto: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Descuento', descuentoSchema, 'descuentos');
