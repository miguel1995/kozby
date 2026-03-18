const mongoose = require('mongoose');
const Transaccion = require('../models/Transaccion');
const productosService = require('./productos.service');

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
      tipo_pago: transaccion.tipo_pago,
      createdAt: transaccion.createdAt,
    };

  } catch (error) {
    console.error('Error al obtener transacción por id:', error);
    throw error;
  }
};


const postTransaccion = async (transaccion) => {
  const productos = transaccion.productos;
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    const newTransaccion = await Transaccion.create(transaccion);
    return newTransaccion;
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    for (const item of productos) {
      const productoId = item.producto_id;
      const varianteId = item.variante_id;
      const cantidad = item.cantidad;
      if (!productoId || !varianteId || cantidad == null) continue;
      await productosService.decrementarCantidadVariante(productoId, varianteId, cantidad, session);
    }
    const newTransaccion = await Transaccion.create([transaccion], { session });
    await session.commitTransaction();
    return newTransaccion[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  getTransacciones,
  getTransaccionById,
  postTransaccion,
};
