// src/services/productos.service.js
const db = require('../config/database');

const getProductos = async () => {
  const [rows] = await db.query('SELECT * FROM productos');
  return rows;
};

module.exports = {
  getProductos,
};



