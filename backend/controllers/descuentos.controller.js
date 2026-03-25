const descuentosService = require('../services/descuentos.service');

const getDescuentos = async (req, res) => {
  try {
    const descuentos = await descuentosService.getDescuentos();
    return res.status(200).json(descuentos);
  } catch (error) {
    console.error('Error al obtener descuentos:', error);
    return res.status(500).json({ message: 'Error al obtener descuentos' });
  }
};

module.exports = {
  getDescuentos,
};
