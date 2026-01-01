// src/services/productos.service.js
const db = require('../config/database');

const getProductosArchivados = async () => {
  const [rows] = await db.query('SELECT * FROM productos WHERE archivado = 1');
  return rows;
}

const getProductos = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE archivado = 0 OR archivado IS NULL');
    return rows;
  } catch (error) {
    if (error.message.includes('archivado')) {
      const [rows] = await db.query('SELECT * FROM productos');
      return rows;
    }
    throw error;
  }
};

const archivarProducto = async (id) => {
  try {
    const [result] = await db.query('UPDATE productos SET archivado = 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    if (error.message.includes('archivado')) {
      throw new Error('El campo "archivado" no existe en la tabla productos. Por favor, agrega la columna: ALTER TABLE productos ADD COLUMN archivado TINYINT(1) DEFAULT 0;');
    }
    throw error;
  }
};

const deleteProducto = async (id) => {
  const productoId = parseInt(id);
  if (isNaN(productoId) || productoId <= 0) {
    throw new Error('ID de producto inválido');
  }

  const [result] = await db.query('DELETE FROM productos WHERE id = ?', [productoId]);

  if (result.affectedRows === 0) {
    throw new Error('Producto no encontrado');
  }

  return true;
};


const createProducto = async (nuevoProducto) => {
  const { nombre, precio, descripcion = null, imagen, categoria_id } = nuevoProducto;

  if (!nombre || !precio || !imagen || !categoria_id) {
    throw new Error('Faltan campos obligatorios');
  }

  const [result] = await db.query(
    'INSERT INTO productos (nombre, precio, descripcion, imagen, categoria_id) VALUES (?, ?, ?, ?, ?)',
    [nombre, precio, descripcion, imagen, categoria_id]
  );

  return {
    id: result.insertId,
    nombre,
    precio,
    descripcion,
    imagen,
    categoria_id
  };
};

const updateProducto = async (id, updates) => {
  const fields = [];
  const values = [];

  const allowed = ['nombre', 'precio', 'descripcion', 'imagen', 'categoria_id'];

  for (const key of Object.keys(updates)) {
    if (allowed.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  }

  if (fields.length === 0) {
    throw new Error('No hay campos válidos para actualizar');
  }

  values.push(id);

  const sql = `UPDATE productos SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await db.query(sql, values);

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  archivarProducto,
  getProductosArchivados,
};