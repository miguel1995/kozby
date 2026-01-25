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
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria_id: producto.categoria_id,
      archivado: producto.archivado,
      variantes: producto.variantes || [],
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
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria_id: producto.categoria_id,
      archivado: producto.archivado,
      variantes: producto.variantes || [],
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
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria_id: producto.categoria_id,
      archivado: producto.archivado,
      variantes: producto.variantes || [],
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt
    };
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw error;
  }
};

// Validar y procesar variantes
const validarYProcesarVariantes = (variantes) => {
  if (!variantes) {
    return [];
  }

  // Si viene como string (desde form-data), parsearlo
  let variantesArray = variantes;
  if (typeof variantes === 'string') {
    try {
      variantesArray = JSON.parse(variantes);
    } catch (error) {
      throw new Error('Las variantes deben ser un JSON válido');
    }
  }

  if (!Array.isArray(variantesArray)) {
    throw new Error('Las variantes deben ser un arreglo');
  }

  if (variantesArray.length > 10) {
    throw new Error('No se pueden tener más de 10 variantes por producto');
  }

  return variantesArray.map((variante, index) => {
    if (!variante.nombre || variante.precio === undefined || variante.cantidad === undefined) {
      throw new Error(`La variante ${index + 1} debe tener nombre, precio y cantidad`);
    }

    // Validar nombre (máximo 45 caracteres)
    const nombre = String(variante.nombre).trim();
    if (nombre.length === 0 || nombre.length > 45) {
      throw new Error(`El nombre de la variante ${index + 1} debe tener entre 1 y 45 caracteres`);
    }

    // Validar y convertir precio
    const precio = typeof variante.precio === 'string' ? parseFloat(variante.precio) : variante.precio;
    if (isNaN(precio) || precio < 0) {
      throw new Error(`El precio de la variante ${index + 1} debe ser un número válido mayor o igual a 0`);
    }

    // Validar formato de precio (máximo 10 dígitos y 2 decimales)
    const precioStr = precio.toString();
    const partes = precioStr.split('.');
    const parteEntera = partes[0];
    const parteDecimal = partes[1] || '';
    const totalDigitos = parteEntera.length + parteDecimal.length;
    
    if (totalDigitos > 10) {
      throw new Error(`El precio de la variante ${index + 1} no puede tener más de 10 dígitos`);
    }
    if (parteDecimal.length > 2) {
      throw new Error(`El precio de la variante ${index + 1} no puede tener más de 2 decimales`);
    }

    // Validar y convertir cantidad (entero de 0 a 1000)
    const cantidad = typeof variante.cantidad === 'string' ? parseInt(variante.cantidad, 10) : variante.cantidad;
    if (!Number.isInteger(cantidad) || cantidad < 0 || cantidad > 1000) {
      throw new Error(`La cantidad de la variante ${index + 1} debe ser un entero entre 0 y 1000`);
    }

    return {
      nombre,
      precio,
      cantidad
    };
  });
};

// Crear un nuevo producto
const createProducto = async (nuevoProducto) => {
  try {
    const { nombre, precio, descripcion = null, imagen = null, categoria_id, variantes } = nuevoProducto;

    if (!nombre || !precio || !categoria_id) {
      throw new Error('Faltan campos obligatorios');
    }

    // Convertir precio a número si viene como string
    const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio;
    
    // Validar que el precio sea un número válido
    if (isNaN(precioNum) || precioNum < 0) {
      throw new Error('El precio debe ser un número válido mayor o igual a 0');
    }
    
    // Convertir categoria_id a string si viene como número
    const categoriaIdStr = String(categoria_id);

    // Validar y procesar variantes
    const variantesProcesadas = validarYProcesarVariantes(variantes);

    const productoData = {
      nombre,
      precio: precioNum,
      descripcion,
      imagen,
      categoria_id: categoriaIdStr,
      archivado: false,
      variantes: variantesProcesadas
    };

    const nuevoProductoDoc = new Producto(productoData);
    const productoGuardado = await nuevoProductoDoc.save();
    
    return {
      id: productoGuardado._id.toString(),
      nombre: productoGuardado.nombre,
      precio: productoGuardado.precio,
      descripcion: productoGuardado.descripcion,
      imagen: productoGuardado.imagen,
      categoria_id: productoGuardado.categoria_id,
      archivado: productoGuardado.archivado,
      variantes: productoGuardado.variantes || [],
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

    const allowed = ['nombre', 'precio', 'descripcion', 'imagen', 'categoria_id', 'variantes'];
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

    // Validar y procesar variantes si están presentes
    if (updateData.variantes !== undefined) {
      updateData.variantes = validarYProcesarVariantes(updateData.variantes);
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

    return {
      id: productoActualizado._id.toString(),
      nombre: productoActualizado.nombre,
      precio: productoActualizado.precio,
      descripcion: productoActualizado.descripcion,
      imagen: productoActualizado.imagen,
      categoria_id: productoActualizado.categoria_id,
      archivado: productoActualizado.archivado,
      variantes: productoActualizado.variantes || [],
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
