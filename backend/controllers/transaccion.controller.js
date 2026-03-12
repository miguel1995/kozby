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

const getTransaccionById = async (req, res) => {
  try{
    const { id } = req.params;

    const transaccion = await transaccionesService.getTransaccionById(id);
    if (!transaccion){
      return res.status(500).json({ message: 'Transacción no encontrada' });
    }

    return res.status(200).json(transaccion);

  } catch (error) {
    console.error('Error al obtener transacción por id:', error);
    return res.status(500).json({ message: 'Error al obtener transacción por id' });
  }
}

const getTransaccionById = async (req, res) => {
  try{
    const { id } = req.params;

    const transaccion = await transaccionesService.getTransaccionById(id);
    if (!transaccion){
      return res.status(500).json({ message: 'Transacción no encontrada' });
    }

    return res.status(200).json(transaccion);

  } catch (error) {
    console.error('Error al obtener transacción por id:', error);
    return res.status(500).json({ message: 'Error al obtener transacción por id' });
  }
}

module.exports = {
  getTransacciones,
  getTransaccionById,
  postTransaccion,
};
