// src/routes/productos.routes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const upload = require('../middleware/upload');

router.get('/', productosController.getProductos);
router.post('/', upload.single('imagen'), productosController.postProducto);
router.get('/archived', productosController.getProductosArchivados); // ✅ Mover aquí

// Rutas con parámetros al final
router.get('/:id', productosController.getProductoById);
router.put('/:id', upload.single('imagen'), productosController.putProducto);
router.delete('/:id', productosController.deleteProducto);
router.patch('/:id/archive', productosController.archiveProducto);
router.put('/:id/restore', productosController.restaurarProducto);


module.exports = router;
