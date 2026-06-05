const nodeHtmlToImage = require('node-html-to-image');
const emailService = require('./email.service');

/**
 * Genera PNG del recibo con el mismo HTML que el correo (imágenes en data URI).
 */
const generateReciboPngBuffer = async (transaccion) => {
  const html = emailService.getReciboHtmlForImageExport(transaccion);

  const buffer = await nodeHtmlToImage({
    html,
    type: 'png',
    timeout: 90_000,
    puppeteerArgs: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  });

  return buffer;
};

module.exports = {
  generateReciboPngBuffer,
};
