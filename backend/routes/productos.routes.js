// src/routes/productos.routes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.getProductos);
router.post('/', productosController.postProducto);
router.put('/:id', productosController.putProducto);
router.delete('/:id', productosController.deleteProducto)
router.patch('/:id/archive', productosController.archiveProducto);
router.get('/archived', productosController.getProductosArchivados);



module.exports = router;
