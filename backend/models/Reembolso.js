const mongoose = require('mongoose');

const reembolsoSchema = new mongoose.Schema({
  transaccion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaccion',
    required: true,
  },
  tipo: {
    type: String,
    enum: ['articulos', 'monto'],
    required: true,
  },
  articulosDevueltos: {
    type: [Object],
    default: [],
  },
  montoDevuelto: {
    type: Number,
    default: 0,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('Reembolso', reembolsoSchema, 'reembolsos');const mongose = require('mongoose');
