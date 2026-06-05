const mongoose = require('mongoose');
const Transaccion = require('../models/transaccion');
const Reembolso = require('../models/Reembolso');
const productosService = require('./productos.service');
const reembolsoService = require('./reembolso.service');

const buildHasReembolsosMap = async (transaccionIds = []) => {
  const uniqueIds = [...new Set(transaccionIds.map((id) => String(id)).filter(Boolean))];
  const validObjectIds = uniqueIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  if (validObjectIds.length === 0 && uniqueIds.length === 0) {
    return new Set();
  }

  const filters = [];
  if (validObjectIds.length > 0) {
    filters.push({ transaccion_id: { $in: validObjectIds } });
  }
  if (uniqueIds.length > 0) {
    filters.push({ transaccion_id: { $in: uniqueIds } });
  }

  const reembolsos = await Reembolso.find(filters.length === 1 ? filters[0] : { $or: filters })
    .select('transaccion_id')
    .lean();

  return new Set(
    reembolsos
      .map((item) => item.transaccion_id?.toString?.() || String(item.transaccion_id))
      .filter(Boolean)
  );
};

const hasReembolsosForTransaccion = async (transaccionId) => {
  if (!transaccionId) return false;
  const map = await buildHasReembolsosMap([transaccionId]);
  return map.has(String(transaccionId));
};

const getTransaccionByRecibo = async (recibo) => {
  if (!recibo) return null;

  const transaccion = await Transaccion.findOne({ recibo }).lean();
  if (!transaccion) return null;

  const id = transaccion._id?.toString?.() || transaccion._id;
  const hasReembolsos = await hasReembolsosForTransaccion(id);

  return {
    id,
    recibo: transaccion.recibo || '',
    total: transaccion.total,
    subtotal: transaccion.subtotal,
    productos_descripcion: transaccion.productos_descripcion,
    descuento: transaccion.descuento || {},
    descuentos: transaccion.descuentos || [],
    tipo_pago: transaccion.tipo_pago,
    createdAt: transaccion.createdAt,
    hasReembolsos,
  };
};

const getTransacciones = async ({ limit = 10, createdAt = null, lastId = null } = {}) => {
  try {
    const filter = {};

    if (createdAt && lastId && mongoose.Types.ObjectId.isValid(lastId)) {
      const cursorDate = new Date(createdAt);
      const cursorId = new mongoose.Types.ObjectId(lastId);

      if (!Number.isNaN(cursorDate.valueOf())) {
        filter.$or = [
          { createdAt: { $lt: cursorDate } },
          { createdAt: cursorDate, _id: { $lt: cursorId } },
        ];
      }
    }

    const docs = await Transaccion.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(Number(limit) + 1)
      .lean();

    const effectiveLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const hasMore = docs.length > effectiveLimit;
    const page = hasMore ? docs.slice(0, effectiveLimit) : docs;

    const hasReembolsosMap = await buildHasReembolsosMap(
      page.map((transaccion) => transaccion._id?.toString?.() || transaccion._id)
    );

    const items = page.map((transaccion) => {
      const id = transaccion._id?.toString?.() || transaccion._id;
      return {
        id,
        recibo: transaccion.recibo || '',
        total: transaccion.total,
        subtotal: transaccion.subtotal,
        productos_descripcion: transaccion.productos_descripcion,
        descuento: transaccion.descuento || {},
        descuentos: transaccion.descuentos || [],
        tipo_pago: transaccion.tipo_pago,
        createdAt: transaccion.createdAt,
        hasReembolsos: hasReembolsosMap.has(String(id)),
      };
    });

    const last = page[page.length - 1];
    const next = hasMore && last
      ? { createdAt: last.createdAt, lastId: last._id?.toString?.() || last._id }
      : null;

    return { items, hasMore, next };
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

    const reembolsos = await reembolsoService.getReembolsosPorTransaccion(id);

    return {
      id: transaccion._id?.toString?.() || transaccion._id,
      recibo: transaccion.recibo || '',
      total: transaccion.total,
      subtotal: transaccion.subtotal,
      productos_descripcion: transaccion.productos_descripcion,
      productos: transaccion.productos || [],
      descuento: transaccion.descuento || {},
      descuentos: transaccion.descuentos || [],
      reembolsos: Array.isArray(reembolsos)
        ? reembolsos.map((r) => ({
            id: r._id?.toString?.() || r._id,
            tipo: r.tipo,
            articulosDevueltos: r.articulosDevueltos || [],
            montoDevuelto: r.montoDevuelto || 0,
            fecha: r.fecha || r.createdAt,
            createdAt: r.createdAt,
          }))
        : [],
      hasReembolsos: Array.isArray(reembolsos) && reembolsos.length > 0,
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
  getTransaccionByRecibo,
};