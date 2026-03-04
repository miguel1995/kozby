const Transaccion = require('../models/transaccion');

const getTransacciones = async () => {
  try {
    const transacciones = await Transaccion.find({})
      .sort({ createdAt: -1 })
      .lean();

    return transacciones.map((t) => ({
      id: t._id?.toString?.() || t._id,
      total: t.total,
      subtotal: t.subtotal,
      productos_descripcion: t.productos_descripcion,
      productos_id: t.productos_id || [],
      descuento: t.descuento || {},
      tipo_pago: t.tipo_pago,
      createdAt: t.createdAt,
    }));
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    throw error;
  }
};

module.exports = {
  getTransacciones,
};
