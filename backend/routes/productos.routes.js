// src/routes/productos.routes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.getProductos);
router.get('/:id', productosController.getProductoById);
router.post('/', productosController.postProducto);
router.put('/:id', productosController.putProducto);
router.delete('/:id', productosController.deleteProducto)


module.exports = router;
