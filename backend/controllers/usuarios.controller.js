const usuariosService = require('../services/usuarios.service');

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.getUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuariosService.getUsuarioById(id);
    if (!usuario) {
      return res.status(500).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario por id:', error);
    return res.status(500).json({ message: 'Error al obtener usuario por id' });
  }
};

const postUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.createUsuario(req.body);
    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
};

const putUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuariosService.updateUsuario(id, req.body);
    if (!usuario) {
      return res.status(500).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await usuariosService.deleteUsuario(id);
    if (!ok) {
      return res.status(500).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  postUsuario,
  putUsuario,
  deleteUsuario,
};
