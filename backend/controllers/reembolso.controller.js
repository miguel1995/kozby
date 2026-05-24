const reembolsoService = require('../services/reembolso.service');
const productosService = require('../services/productos.service');
const Transaccion = require('../models/transaccion');


const getReembolsosPorTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const reembolsos = await reembolsoService.getReembolsosPorTransaccion(id);
    return res.status(200).json(reembolsos);
  } catch (error) {
    console.error('Error al obtener reembolsos:', error);
    return res.status(500).json({ message: 'Error al obtener reembolsos' });
  }
};

const postReembolso = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, articulosDevueltos, montoDevuelto } = req.body;
    const transaccion = await Transaccion.findById(id);
    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    if (tipo === 'articulos' && Array.isArray(articulosDevueltos)) {
      for (const item of articulosDevueltos) {

        if (item.producto_id && item.variante_id && item.cantidad) {
          await productosService.incrementarCantidadVariante(item.producto_id, item.variante_id, item.cantidad);
        }
      }
    }

    const reembolso = await reembolsoService.crearReembolso({
      transaccion_id: id,
      tipo,
      articulosDevueltos: articulosDevueltos || [],
      montoDevuelto: montoDevuelto || 0,
    });
    return res.status(201).json(reembolso);
  } catch (error) {
    console.error('Error al procesar reembolso:', error);
    return res.status(500).json({ message: 'Error al procesar reembolso' });
  }
};

module.exports = {
  postReembolso,
  getReembolsosPorTransaccion,
};