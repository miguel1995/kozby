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

const postDescuento = async (req, res) => {
  try {
    const descuento = await descuentosService.postDescuento(req.body);
    return res.status(200).json(descuento);
  } catch (error) {
    console.error('Error al crear descuento:', error);
    return res.status(500).json({ message: 'Error al crear descuento' });
  }
};

const putDescuento = async (req, res) => {
  try {
    const descuento = await descuentosService.putDescuento(req.params.id, req.body);
    return res.status(200).json(descuento);
  } catch (error) {
    console.error('Error al actualizar descuento:', error);
    return res.status(500).json({ message: 'Error al actualizar descuento' });
  }
};

const deleteDescuento = async (req, res) =>{
  try {
    const descuento = await descuentosService.deleteDescuento(req.params.id);
    return res.status(200).json(descuento);
  } catch (error) {
    console.error('Error al eliminar descuento:', error);
    return res.status(500).json({ message: 'Error al eliminar descuento' });
  }
}

module.exports = {
  getDescuentos,
  postDescuento,
  putDescuento,
  deleteDescuento
};
