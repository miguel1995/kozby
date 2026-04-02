const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');
const authenticationUtils = require('../utils/authentication.utils');

router.get('/', authenticationUtils.verifyToken, usuariosController.getUsuarios);
router.get('/:id', authenticationUtils.verifyToken, usuariosController.getUsuarioById);

router.post('/', authenticationUtils.verifyToken, usuariosController.postUsuario);
router.put('/:id', authenticationUtils.verifyToken, usuariosController.putUsuario);
router.delete('/:id', authenticationUtils.verifyToken, usuariosController.deleteUsuario);

module.exports = router;
