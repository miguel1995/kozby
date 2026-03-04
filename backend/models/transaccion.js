const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
    total : { type: Number, required: true },
    subtotal : { type: Number, required: true },
    productos_descripcion : { type: String, default: '' },
    productos_id : { type: [String], default: [] },
    descuento : {type: Object, default: {}},
    tipo_pago : {type: String, default: ''},
},
{  timestamp: { createdAt: true, updatedAt: false },
  versionKey: false },
);

module.exports = mongoose.model('Transaccion', transaccionSchema, 'transacciones');
