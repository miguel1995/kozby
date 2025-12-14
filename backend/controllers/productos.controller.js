// src/controllers/productos.controller.js
const productosService = require('../services/productos.service');

const getProductos = async (req, res) => {
  try {
    const productos = await productosService.getProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

module.exports = {
  getProductos,
};
