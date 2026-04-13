const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccion.controller');
const authenticationUtils = require('../utils/authentication.utils');

router.get('/', authenticationUtils.verifyToken, transaccionController.getTransacciones);

router.get(
  '/export/excel',
  authenticationUtils.verifyToken,
  transaccionController.getExportExcel
);

router.post(
  '/:id/enviar-correo',
  authenticationUtils.verifyToken,
  transaccionController.postEnviarCorreo
);

router.get('/:id', authenticationUtils.verifyToken, transaccionController.getTransaccionById);

router.post('/', authenticationUtils.verifyToken, transaccionController.postTransaccion);

module.exports = router;
