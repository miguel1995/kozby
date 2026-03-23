const { default: mongoose } = require('mongoose');
const Transaccion = require('../models/transaccion');

const getTransacciones = async () => {
  try {
    const transacciones = await Transaccion.find({})
      .sort({ createdAt: -1 })
      .lean();

    return transacciones.map((transaccion) => ({
      id: transaccion._id?.toString?.() || transaccion._id,
      total: transaccion.total,
      subtotal: transaccion.subtotal,
      productos_descripcion: transaccion.productos_descripcion,
      descuento: transaccion.descuento || {},
      descuentos: transaccion.descuentos || [],
      tipo_pago: transaccion.tipo_pago,
      createdAt: transaccion.createdAt,
    }));
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    throw error;
  }
};

const getTransaccionById = async (id) => {
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;

    const transaccion = await Transaccion.findById(id).lean();
    if (!transaccion) return null;

    return {
      id: transaccion._id?.toString?.() || transaccion._id,
      total: transaccion.total,
      subtotal: transaccion.subtotal,
      productos_descripcion: transaccion.productos_descripcion,
      productos: transaccion.productos || [],
      descuento: transaccion.descuento || {},
      descuentos: transaccion.descuentos || [],
      tipo_pago: transaccion.tipo_pago,
      createdAt: transaccion.createdAt,
    };

  } catch (error) {
    console.error('Error al obtener transacción por id:', error);
    throw error;
  }
};


const postTransaccion = async (transaccion) => {
  try {
    const newTransaccion = await Transaccion.create(transaccion);
    return newTransaccion;
  } catch (error) {
    console.error('Error al crear transaccion:', error);
    throw error;
  }
};

module.exports = {
  getTransacciones,
  getTransaccionById,
  postTransaccion,
};
