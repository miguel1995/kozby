const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
    total : { type: Number, required: true },
    subtotal : { type: Number, required: true },
    productos_descripcion : { type: String, default: '' },
    productos : { type: [Object], default: [] },
    descuento : {type: Object, default: {}},
    descuentos: { type: [Object], default: [] },
    tipo_pago : {type: String, default: ''},
    monto: {type: Number, default: 0},
    cambio: {type: Number, default: 0},
},
{
    timestamps: true,
    versionKey: false,
},
);

module.exports = mongoose.model('Transaccion', transaccionSchema, 'transacciones');
