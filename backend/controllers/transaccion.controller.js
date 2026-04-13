const transaccionesService = require('../services/transacciones.service');
const emailService = require('../services/email.service');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getTransacciones = async (req, res) => {
  try {
    const { limit, createdAt, lastId } = req.query;
    const result = await transaccionesService.getTransacciones({ limit, createdAt, lastId });
    return res.status(200).json(result);
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

const postEnviarCorreo = async (req, res) => {
  try {
    const { id } = req.params;
    const to = (req.body && req.body.to) ? String(req.body.to).trim() : '';

    if (!to || !EMAIL_RE.test(to)) {
      return res.status(400).json({ message: 'Indique un correo electrónico válido en "to"' });
    }

    const transaccion = await transaccionesService.getTransaccionById(id);
    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    await emailService.sendTransaccionCorreo({ to, transaccion });
    return res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo de transacción:', error);
    const msg =
      error.message && error.message.includes('MAIL_USER')
        ? error.message
        : 'No se pudo enviar el correo. Revise la configuración SMTP.';
    return res.status(500).json({ message: msg });
  }
};

const postTransaccion = async (req, res) => {
  try {
    const transaccion = await transaccionesService.postTransaccion(req.body);
    return res.status(200).json(transaccion);
  } catch (error) {
    console.error('Error al crear transaccion:', error);
    const isStockError =
      error.message && (
        error.message.includes('Stock insuficiente') ||
        error.message.includes('no encontrado') ||
        error.message.includes('Variante no encontrada')
      );
    if (isStockError) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error al crear transaccion' });
  }
};

module.exports = {
  getTransacciones,
  getTransaccionById,
  postEnviarCorreo,
  postTransaccion,
};
