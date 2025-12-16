// src/services/productos.service.js
const db = require('../config/database');

const getProductos = async () => {
  const [rows] = await db.query('SELECT * FROM productos');
  return rows;
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



module.exports = {
  getProductos,
  createProducto,
};



