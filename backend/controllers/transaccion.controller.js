const transaccionesService = require('../services/transacciones.service');
const transaccionesExcelService = require('../services/transaccionesExcel.service');
const emailService = require('../services/email.service');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generarReciboCorto() {
  return Date.now().toString(36).toUpperCase();
}

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

const getExportExcel = async (req, res) => {
  try {
    const desde = req.query.desde ? String(req.query.desde).trim() : '';
    const hasta = req.query.hasta ? String(req.query.hasta).trim() : '';

    if (!desde || !hasta) {
      return res.status(400).json({
        message: 'Indique fecha inicial (desde) y fecha final (hasta) en la consulta.',
      });
    }

    const buffer = await transaccionesExcelService.buildTransaccionesExcelBuffer({
      desde,
      hasta,
    });

    const filename = `transacciones-${desde.slice(0, 10)}_a_${hasta.slice(0, 10)}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('Error al exportar transacciones a Excel:', error);
    if (error.code === 'BAD_RANGE') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error al generar el archivo Excel' });
  }
};

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
    req.body.recibo = generarReciboCorto();
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
  getExportExcel,
  getTransaccionById,
  postEnviarCorreo,
  postTransaccion,
};
