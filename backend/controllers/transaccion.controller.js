const transaccionesService = require('../services/transacciones.service');

const getTransacciones = async (req, res) => {
  try {
    const transacciones = await transaccionesService.getTransacciones();
    return res.status(200).json(transacciones);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    return res.status(500).json({ message: 'Error al obtener transacciones' });
  }
};

module.exports = {
  getTransacciones,
};
