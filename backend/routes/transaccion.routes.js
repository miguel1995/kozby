const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccion.controller');
const authenticationUtils = require('../utils/authentication.utils');

router.get('/', authenticationUtils.verifyToken, transaccionController.getTransacciones);
router.get('/:id', authenticationUtils.verifyToken, transaccionController.getTransaccionById);


module.exports = router;
