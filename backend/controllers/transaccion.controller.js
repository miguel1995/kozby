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

const postTransaccion = async (req, res) => {
  try {
    const transaccion = await transaccionesService.postTransaccion(req.body);
    return res.status(200).json(transaccion);
  } catch (error) {
    console.error('Error al crear transaccion:', error);
    return res.status(500).json({ message: 'Error al crear transaccion' });
  }
};
module.exports = {
  getTransacciones,
  postTransaccion,
};
