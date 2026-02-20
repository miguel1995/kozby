// src/routes/productos.routes.js
const authenticationUtils = require('../utils/authentication.utils');
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const upload = require('../middleware/upload');

router.get('/', authenticationUtils.verifyToken, productosController.getProductos);
router.post('/', authenticationUtils.verifyToken, upload.single('imagen'), productosController.postProducto);
router.get('/archived', authenticationUtils.verifyToken, productosController.getProductosArchivados);

router.get('/:id', authenticationUtils.verifyToken, productosController.getProductoById);
router.patch('/:id/restore', authenticationUtils.verifyToken, productosController.restaurarProducto);
router.put('/:id', authenticationUtils.verifyToken, upload.single('imagen'), productosController.putProducto);
router.delete('/:id', authenticationUtils.verifyToken, productosController.deleteProducto);
router.patch('/:id/archive', authenticationUtils.verifyToken, productosController.archiveProducto);

module.exports = router;

