const express = require('express');
const router = express.Router();
const authenticationUtils = require('../utils/authentication.utils');
const descuentosController = require('../controllers/descuentos.controller');

router.get('/', authenticationUtils.verifyToken, descuentosController.getDescuentos);
router.post('/', authenticationUtils.verifyToken, descuentosController.postDescuento);
router.put('/:id', authenticationUtils.verifyToken, descuentosController.putDescuento);
router.delete('/:id', authenticationUtils.verifyToken, descuentosController.deleteDescuento);

module.exports = router;
