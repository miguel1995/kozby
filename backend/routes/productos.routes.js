// src/routes/productos.routes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.getProductos);
router.post('/', productosController.postProducto);


module.exports = router;
