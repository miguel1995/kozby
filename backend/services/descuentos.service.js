const mongoose = require('mongoose');
const Descuento = require('../models/Descuento');

const getDescuentos = async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error(
      `La conexión a MongoDB no está lista. Estado: ${mongoose.connection.readyState}`
    );
  }

  const descuentos = await Descuento.find({}).sort({ nombre: 1 }).lean();

  return descuentos.map((d) => ({
    id: d._id?.toString?.() || d._id,
    nombre: d.nombre,
    tipo: d.tipo,
    monto: d.monto,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));
};

const postDescuento = async (descuento) => {
  const newDescuento = await Descuento.create(descuento);
  return newDescuento;
};

const putDescuento = async (id, descuento) => {
  const updatedDescuento = await Descuento.findByIdAndUpdate(id, descuento, { new: true });
  return updatedDescuento;
};

const deleteDescuento = async (id) => {
  const deletedDescuento = await Descuento.findByIdAndDelete(id);
  return deletedDescuento;
};

module.exports = {
  getDescuentos,
  postDescuento,
  putDescuento,
  deleteDescuento
};
