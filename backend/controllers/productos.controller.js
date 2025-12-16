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

const postProducto = async (req, res) => {
  try {
    const nuevoProducto = req.body;

    if (!nuevoProducto.nombre || !nuevoProducto.precio){
      return res.status(400).json({ message: 'faltan campos que son obligatorios'});
    }

    const productoCreado = await productosService.createProducto(nuevoProducto);

    res.status(201).json({
      message: 'producto creado de manera exitosa', 
      producto: productoCreado
    });
  } catch (error) {
    console.error('Error al crear producto:', error); 
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

module.exports = {
  getProductos,
  postProducto,
};
