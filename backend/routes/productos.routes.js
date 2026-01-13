// src/routes/productos.routes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const upload = require('../middleware/upload');

// Rutas específicas deben ir antes de las rutas con parámetros
router.get('/', productosController.getProductos);
router.post('/', upload.single('imagen'), productosController.postProducto);

// Rutas con parámetros al final
router.get('/:id', productosController.getProductoById);
router.put('/:id', upload.single('imagen'), productosController.putProducto);
router.delete('/:id', productosController.deleteProducto)


module.exports = router;
