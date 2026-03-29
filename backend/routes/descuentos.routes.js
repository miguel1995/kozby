const express = require('express');
const router = express.Router();
const authenticationUtils = require('../utils/authentication.utils');
const descuentosController = require('../controllers/descuentos.controller');

router.get('/', authenticationUtils.verifyToken, descuentosController.getDescuentos);

module.exports = router;
