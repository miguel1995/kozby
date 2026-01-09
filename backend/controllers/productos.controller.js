const productosService = require('../services/productos.service');


const getProductos = async (req, res) => {
  try {
    const productos = await productosService.getProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};


const getProductosArchivados = async (req, res) => {
  try {
    const productos = await productosService.getProductosArchivados();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos archivados:', error);
    res.status(500).json({ message: 'Error al obtener productos archivados' });
  }
};


const postProducto = async (req, res) => {
  try {
    const nuevoProducto = req.body;

    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const productoCreado = await productosService.createProducto(nuevoProducto);

    res.status(201).json({
      message: 'Producto creado correctamente',
      producto: productoCreado,
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
      return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
    }

    const productoActualizado = await productosService.updateProducto(id, updates);

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({
      message: 'Producto actualizado correctamente',
      producto: productoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};


const archiveProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await productosService.archivarProducto(id);

    if (!ok) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto archivado correctamente' });
  } catch (error) {
    console.error('Error al archivar producto:', error);
    res.status(500).json({ message: 'Error al archivar producto' });
  }
};

const restaurarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await productosService.restaurarProducto(id);

    if (!ok) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto restaurado correctamente' });
  } catch (error) {
    console.error('Error al restaurar producto:', error);
    res.status(500).json({ message: 'Error al restaurar producto' });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await productosService.deleteProducto(id);

    if (!eliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

module.exports = {
  getProductos,
  getProductosArchivados,
  postProducto,
  putProducto,
  archiveProducto,
  deleteProducto,
  restaurarProducto,
};
