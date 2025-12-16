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

    res.status(200).json({
      message: 'producto creado de manera exitosa', 
      producto: productoCreado
    });
  } catch (error) {
    console.error('Error al crear producto:', error); 
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

const putProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    const productoActualizado = await productosService.updateProducto(id, updates);

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'producto actualizado', producto: productoActualizado });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

module.exports = {
  getProductos,
  postProducto,
  putProducto,
};
