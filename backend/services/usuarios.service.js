const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

const getUsuarios = async () => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error(`La conexión a MongoDB no está lista. Estado: ${mongoose.connection.readyState}`);
    }

    const usuarios = await Usuario.find({}).select('-password').lean();

    return usuarios.map((usuario) => ({
        id: usuario._id?.toString?.() || usuario._id,
        username: usuario.username,
        role: usuario.role,
    }));
};

const getUsuarioById = async (id) => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error(`La conexión a MongoDB no está lista. Estado: ${mongoose.connection.readyState}`);
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;

    const usuario = await Usuario.findById(id).select('-password').lean();
    if (!usuario) return null;

    return {
        id: usuario._id?.toString?.() || usuario._id,
        username: usuario.username,
        role: usuario.role,
    };
}

const createUsuario = async (data) => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error(`La conexión a MongoDB no está lista. Estado: ${mongoose.connection.readyState}`);
    }

    try {
        const { username, password, role } = data || {};
        const created = await Usuario.create({ username, password, role });

        return {
            id: created._id?.toString?.() || created._id,
            username: created.username,
            role: created.role,
        };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

const updateUsuario = async (id, updates) => {

    let updated = null;
    if (mongoose.connection.readyState !== 1) {
        throw new Error(`La conexión a MongoDB no está lista. Estado: ${mongoose.connection.readyState}`);
    }

    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;

        if (updates.password) {

         updated = await Usuario.findByIdAndUpdate(
                id,
                { $set: updates || {} },
                { new: true, runValidators: true }
            ).lean();

        } else {
            
         updated = await Usuario.findByIdAndUpdate(
            id,
            { $set: updates || {} },
            { new: true, runValidators: true }
        ).select('-password').lean();
        }

        if (!updated) return null;

        return {
            id: updated._id?.toString?.() || updated._id,
            username: updated.username,
            role: updated.role,
        };
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

const deleteUsuario = async (id) => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error(`La conexión a MongoDB no está lista. Estado: ${mongoose.connection.readyState}`);
    }

    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) return false;

        const deleted = await Usuario.findByIdAndDelete(id);
        return !!deleted;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};


module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
};
