// src/services/productos.service.js
const mongoose = require('mongoose');
const Producto = require('../models/Producto');

// Obtener todos los productos no archivados
const getProductos = async () => {
  try {
    // Verificar que la conexión esté lista
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`La conexión a MongoDB no está lista. Estado: ${mongoose.connection.readyState} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
    }

    const productos = await Producto.find({ archivado: false })
      .sort({ createdAt: -1 })
      .lean(); // lean() retorna objetos JavaScript planos en lugar de documentos Mongoose
    
    return productos.map(producto => ({
      id: producto._id.toString(),
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad, 
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria_id: producto.categoria_id,
      archivado: producto.archivado,
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt
    }));
  } catch (error) {
    console.error('Error al obtener productos:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

// Obtener todos los productos archivados
const getProductosArchivados = async () => {
  try {
    const productos = await Producto.find({ archivado: true })
      .sort({ createdAt: -1 })
      .lean();
    
    return productos.map(producto => ({
      id: producto._id.toString(),
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria_id: producto.categoria_id,
      archivado: producto.archivado,
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt
    }));
  } catch (error) {
    console.error('Error al obtener productos archivados:', error);
    throw error;
  }
};

// Obtener un producto por ID
const getProductoById = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de producto inválido');
    }

    // Verificar si el ID es válido para MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const producto = await Producto.findById(id).lean();
    
    if (!producto) {
      return null;
    }
    
    return {
      id: producto._id.toString(),
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria_id: producto.categoria_id,
      archivado: producto.archivado,
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt
    };
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw error;
  }
};

// Crear un nuevo producto
const createProducto = async (nuevoProducto) => {
  try {
  const { nombre, precio, cantidad, descripcion = null, imagen, categoria_id } = nuevoProducto;

if (nombre == null || precio == null || cantidad == null || !imagen || !categoria_id) {
  throw new Error('Faltan campos obligatorios');
}

if (cantidad < 0) {
  throw new Error('La cantidad no puede ser negativa');
}

    // Convertir precio a número si viene como string
    const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio;
    
    // Validar que el precio sea un número válido
    if (isNaN(precioNum) || precioNum < 0) {
      throw new Error('El precio debe ser un número válido mayor o igual a 0');
    }
    
    // Convertir categoria_id a string si viene como número
    const categoriaIdStr = String(categoria_id);

    const productoData = {
      nombre,
      precio: precioNum,
      cantidad,
      descripcion,
      imagen,
      categoria_id: categoriaIdStr,
      archivado: false
    };

    const nuevoProductoDoc = new Producto(productoData);
    const productoGuardado = await nuevoProductoDoc.save();
    
    return {
      id: productoGuardado._id.toString(),
      nombre: productoGuardado.nombre,
      precio: productoGuardado.precio,
      descripcion: productoGuardado.descripcion,
      cantidad: productoGuardado.cantidad,
      imagen: productoGuardado.imagen,
      categoria_id: productoGuardado.categoria_id,
      archivado: productoGuardado.archivado,
      createdAt: productoGuardado.createdAt,
      updatedAt: productoGuardado.updatedAt
    };
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar un producto
const updateProducto = async (id, updates) => {
  try {
    if (!id) {
      throw new Error('ID de producto inválido');
    }

    // Verificar si el ID es válido para MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const allowed = ['nombre', 'precio', 'cantidad', 'descripcion', 'imagen', 'categoria_id'];
    const updateData = {};

    // Filtrar solo campos permitidos
    for (const key of Object.keys(updates)) {
      if (allowed.includes(key)) {
        updateData[key] = updates[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // Convertir precio a número si está presente
    if (updateData.precio !== undefined) {
      updateData.precio = typeof updateData.precio === 'string' 
        ? parseFloat(updateData.precio) 
        : updateData.precio;
      
      if (isNaN(updateData.precio) || updateData.precio < 0) {
        throw new Error('El precio debe ser un número válido mayor o igual a 0');
      }
    }

    // Convertir categoria_id a string si está presente
    if (updateData.categoria_id !== undefined) {
      updateData.categoria_id = String(updateData.categoria_id);
    }

    // Actualizar el producto (findByIdAndUpdate retorna el documento actualizado)
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!productoActualizado) {
      return null;
    }

    if (productoActualizado.cantidad < 0) {
      throw new Error('La cantidad no puede ser negativa');
    }

    return {
      id: productoActualizado._id.toString(),
      nombre: productoActualizado.nombre,
      precio: productoActualizado.precio,
      cantidad: productoActualizado.cantidad,
      descripcion: productoActualizado.descripcion,
      imagen: productoActualizado.imagen,
      categoria_id: productoActualizado.categoria_id,
      archivado: productoActualizado.archivado,
      createdAt: productoActualizado.createdAt,
      updatedAt: productoActualizado.updatedAt
    };
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Archivar un producto
const archivarProducto = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de producto inválido');
    }

    // Verificar si el ID es válido para MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const producto = await Producto.findByIdAndUpdate(
      id,
      { $set: { archivado: true } },
      { new: true }
    );

    return producto !== null;
  } catch (error) {
    console.error('Error al archivar producto:', error);
    throw error;
  }
};

// Restaurar un producto
const restaurarProducto = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de producto inválido');
    }

    // Verificar si el ID es válido para MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const producto = await Producto.findByIdAndUpdate(
      id,
      { $set: { archivado: false } },
      { new: true }
    );

    return producto !== null;
  } catch (error) {
    console.error('Error al restaurar producto:', error);
    throw error;
  }
};

// Eliminar un producto
const deleteProducto = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de producto inválido');
    }

    // Verificar si el ID es válido para MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Producto no encontrado');
    }

    const producto = await Producto.findByIdAndDelete(id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  archivarProducto,
  getProductosArchivados,
  restaurarProducto,
};
