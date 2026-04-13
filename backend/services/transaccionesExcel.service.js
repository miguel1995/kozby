const XLSX = require('xlsx');
const Transaccion = require('../models/transaccion');

/**
 * @param {{ desde?: string, hasta?: string }} [opts] - ISO 8601 o fechas parseables por Date.
 *   Si ambas faltan, exporta toda la colección.
 */
const buildTransaccionesExcelBuffer = async (opts = {}) => {
  const { desde, hasta } = opts;
  const filter = {};

  if (desde || hasta) {
    if (!desde || !hasta) {
      const err = new Error('Debe indicar fecha inicial y fecha final');
      err.code = 'BAD_RANGE';
      throw err;
    }
    const dStart = new Date(desde);
    const dEnd = new Date(hasta);
    if (Number.isNaN(dStart.getTime()) || Number.isNaN(dEnd.getTime())) {
      const err = new Error('Fechas inválidas');
      err.code = 'BAD_RANGE';
      throw err;
    }
    if (dStart > dEnd) {
      const err = new Error('La fecha inicial no puede ser posterior a la final');
      err.code = 'BAD_RANGE';
      throw err;
    }
    filter.createdAt = { $gte: dStart, $lte: dEnd };
  }

  const docs = await Transaccion.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const rows = docs.map((doc) => ({
    id: doc._id?.toString?.() || '',
    total: doc.total,
    subtotal: doc.subtotal,
    tipo_pago: doc.tipo_pago ?? '',
    productos_descripcion: doc.productos_descripcion ?? '',
    monto: doc.monto,
    cambio: doc.cambio,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : '',
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : '',
    productos_json: JSON.stringify(doc.productos ?? []),
    descuentos_json: JSON.stringify(doc.descuentos ?? []),
    descuento_json: JSON.stringify(doc.descuento ?? {}),
  }));

  const sheetData = rows.length
    ? rows
    : [{ mensaje: 'No hay transacciones en la base de datos' }];

  const ws = XLSX.utils.json_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transacciones');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

module.exports = {
  buildTransaccionesExcelBuffer,
};
