// src/services/productos.service.js
const db = require('../config/database');

const PRODUCTOS_REF = 'productos';

// Obtener todos los productos no archivados
const getProductos = async () => {
  try {
    const snapshot = await db.ref(`${PRODUCTOS_REF}`)
      .orderByChild('archivado')
      .equalTo(false)
      .once('value');
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const productos = [];
    snapshot.forEach((childSnapshot) => {
      productos.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Obtener todos los productos archivados
const getProductosArchivados = async () => {
  try {
    const snapshot = await db.ref(`${PRODUCTOS_REF}`)
      .orderByChild('archivado')
      .equalTo(true)
      .once('value');
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const productos = [];
    snapshot.forEach((childSnapshot) => {
      productos.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    return productos;
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

    const snapshot = await db.ref(`${PRODUCTOS_REF}/${id}`).once('value');
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      id: snapshot.key,
      ...snapshot.val()
    };
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw error;
  }
};

// Crear un nuevo producto
const createProducto = async (nuevoProducto) => {
  try {
    const { nombre, precio, descripcion = null, imagen = null, categoria_id } = nuevoProducto;

    if (!nombre || !precio || !categoria_id) {
      throw new Error('Faltan campos obligatorios');
    }

    // Convertir precio a número si viene como string
    const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio;
    
    // Convertir categoria_id a string si viene como número
    const categoriaIdStr = String(categoria_id);

    const productoData = {
      nombre,
      precio: precioNum,
      descripcion,
      imagen,
      categoria_id: categoriaIdStr,
      archivado: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Crear nuevo producto (push genera un ID único automáticamente)
    const newProductRef = await db.ref(PRODUCTOS_REF).push(productoData);
    
    return {
      id: newProductRef.key,
      ...productoData
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

    const allowed = ['nombre', 'precio', 'descripcion', 'imagen', 'categoria_id'];
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
    }

    // Convertir categoria_id a string si está presente
    if (updateData.categoria_id !== undefined) {
      updateData.categoria_id = String(updateData.categoria_id);
    }

    // Agregar timestamp de actualización
    updateData.updatedAt = new Date().toISOString();

    const productoRef = db.ref(`${PRODUCTOS_REF}/${id}`);
    
    // Verificar que el producto existe
    const snapshot = await productoRef.once('value');
    if (!snapshot.exists()) {
      return null;
    }

    // Actualizar solo los campos especificados
    await productoRef.update(updateData);

    // Obtener el producto actualizado
    const updatedSnapshot = await productoRef.once('value');
    return {
      id: updatedSnapshot.key,
      ...updatedSnapshot.val()
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

    const productoRef = db.ref(`${PRODUCTOS_REF}/${id}`);
    const snapshot = await productoRef.once('value');

    if (!snapshot.exists()) {
      return false;
    }

    await productoRef.update({
      archivado: true,
      updatedAt: new Date().toISOString()
    });

    return true;
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

    const productoRef = db.ref(`${PRODUCTOS_REF}/${id}`);
    const snapshot = await productoRef.once('value');

    if (!snapshot.exists()) {
      return false;
    }

    await productoRef.update({
      archivado: false,
      updatedAt: new Date().toISOString()
    });

    return true;
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

    const productoRef = db.ref(`${PRODUCTOS_REF}/${id}`);
    const snapshot = await productoRef.once('value');

    if (!snapshot.exists()) {
      throw new Error('Producto no encontrado');
    }

    await productoRef.remove();
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
