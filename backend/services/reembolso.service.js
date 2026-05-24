const Reembolso = require('../models/Reembolso');
const mongoose = require('mongoose');

const crearReembolso = async ({ transaccion_id, tipo, articulosDevueltos = [], montoDevuelto = 0 }) => {
  if (!transaccion_id || !tipo) throw new Error('Faltan datos requeridos');
  const castTransaccionId = mongoose.Types.ObjectId.isValid(transaccion_id)
    ? new mongoose.Types.ObjectId(transaccion_id)
    : transaccion_id;
  const reembolso = new Reembolso({
    transaccion_id: castTransaccionId,
    tipo,
    articulosDevueltos,
    montoDevuelto,
  });
  await reembolso.save();
  return reembolso;
};


const getReembolsosPorTransaccion = async (transaccion_id) => {
  if (!transaccion_id) return [];

  const filters = [{ transaccion_id }];
  if (mongoose.Types.ObjectId.isValid(transaccion_id)) {
    filters.push({ transaccion_id: new mongoose.Types.ObjectId(transaccion_id) });
  }
  return await Reembolso.find({ $or: filters }).sort({ createdAt: -1, _id: -1 }).lean();
};

module.exports = {
  crearReembolso,
  getReembolsosPorTransaccion,
};
