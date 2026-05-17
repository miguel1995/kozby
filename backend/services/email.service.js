const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

/** Adjunto inline para <img src="cid:..."> — debe coincidir con el HTML */
const EMAIL_MAP_CID = 'email_map@kozby';
const EMAIL_MAP_PATH = path.join(__dirname, '..', 'assets', 'images', 'email_map.png');

const EMAIL_LOGO_CID = 'email_logo@kozby';
const EMAIL_LOGO_PATH = path.join(__dirname, '..', 'assets', 'images', 'email_icon.png');

const EMAIL_CASH_CID = 'email_cash@kozby';
const EMAIL_CASH_PATH = path.join(__dirname, '..', 'assets', 'images', 'email_cash_icon.png');


/**
 * Gmail SMTP: usa una "Contraseña de aplicación" (no la contraseña normal).
 * Variables: MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_APP_PASSWORD, MAIL_FROM
 */
const getTransporter = () => {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      'Configura MAIL_USER y MAIL_APP_PASSWORD en el archivo .env del backend'
    );
  }

  const port = Number(process.env.MAIL_PORT) || 587;
  const secure = process.env.MAIL_SECURE === 'true';

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port,
    secure,
    auth: { user, pass },
  });
};

const formatMoney = (value) =>
  `$ ${Number(value || 0).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const buildTransactionHtml = (transaccion) => {
  const id = transaccion.recibo || '-';
  const productos = Array.isArray(transaccion.productos) ? transaccion.productos : [];
  const descuentos = Array.isArray(transaccion.descuentos) ? transaccion.descuentos : [];

  const productosRows = productos
    .map(
      (p) =>
        `<tr><td style="border-style: hidden;"><div>${escapeHtml(p.producto_nombre || '-')}</div><div>${escapeHtml(String(p.variante_nombre || ''))}</div></td><td style="border-style: hidden;">x ${p.cantidad ?? 1}</td><td style="border-style: hidden; text-align: right;">${formatMoney(
          (Number(p.precio) || 0) * (Number(p.cantidad) || 1)
        )}</td></tr>`
    )
    .join('');

  const descRows = descuentos
    .map((d) => {
      const val =
        (d?.tipo || '').toUpperCase() === 'PORCENTAJE'
          ? formatMoney((transaccion.total * (d?.monto ?? 0) / 100))
          : formatMoney(d?.monto);

      const valTipo = (d?.tipo || '').toUpperCase() === 'PORCENTAJE' ? `${d?.monto ?? '-'}%` : '';

      return `<tr><td  style="border-style: hidden;">${escapeHtml(d?.nombre || 'Descuento')}</td><td style="border-style: hidden;">${escapeHtml(
        valTipo || ''
      )}</td><td  style="border-style: hidden; text-align: right;">- ${val}</td></tr>`;
    })
    .join('');
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
</head>

<body style="font-family: system-ui, sans-serif; color: #111; display: flexbox; justify-content: center; ">
    <div style="display: flex; justify-content: center; width: 499px; margin: auto; background-color: #f3f4f6;">
    <div style="width: 375px; margin: auto; background-color: #ffffff;">
        <div
            style="background-color: #546376; display: flexbox; justify-content: center; padding-top: 20px; height: 50px;">
            <div
                style="background-color: #546376; border: solid 4px #fff; border-radius: 10%;  height: 50px; margin: auto; width: 50px; position: absolute; left: 50%; transform: translateX(-50%); margin-top: 20px;">
                
                <img src="cid:${EMAIL_LOGO_CID}" width="50" height="50" alt="Kozby" style="border: 0; border-radius: 10%; display: block; max-width: 100%; height: auto;" />
                </div>

        </div>
        <div style="color: #546376; margin: auto; width: fit-content; margin-top: 25px; font-weight: bold;">Kozby</div>
        <div style="font-size: 64px;  color: #3d454d; font-weight: 600; padding-top: 32px; text-align: center;">
        
            ${formatMoney(transaccion.total)}
            
        </div>

        <div style="border-top: dashed 2px #546376; width: 100%; height: 1px; margin-top: 16px;"></div>

        <table border="1" cellpadding="8" cellspacing="0" style="border: none; width: 100%;">
            <thead>
                
            </thead>
            <tbody>${productosRows || '<tr><td colspan="4">Sin productos</td></tr>'}</tbody>
        </table>
         ${descuentos.length
      ? `<h3>Descuentos</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border: none; width: 100%;">
            <thead>
               
            </thead>
            <tbody>${descRows}</tbody>
        </table>`
      : ''
    }

        <div style="border-top: dashed 2px #546376; width: 100%; height: 1px; margin-top: 16px;"></div>

        

         <table border="1" cellpadding="8" cellspacing="0" style="border: none; width: 100%;">
            <thead>
               
            </thead>
            <tbody>
            <tr><td style="border-style: hidden; font-weight: bold;">Total</td><td style="border-style: hidden;"></td><td style="border-style: hidden; text-align: right; font-weight: bold;">${formatMoney(transaccion.total)}</td></tr>
            <tr><td style="border-style: hidden; font-weight: bold;">Tipo de pago</td><td style="border-style: hidden;">${escapeHtml(String(transaccion.tipo_pago || '').toUpperCase() || '-')}</td><td style="border-style: hidden; text-align: right; font-weight: bold;"></td></tr>            
            </tbody>
        </table>

        ${getMapImageHtml()}

         <table border="1" cellpadding="8" cellspacing="0" style="border: none; width: 100%;">
            <thead>
               
            </thead>
            <tbody>            
            <tr><td style="border-style: hidden; ">${escapeHtml(String(transaccion.tipo_pago || '').toUpperCase() || '-')}</td> <td style="border-style: hidden;"></td><td style="border-style: hidden; text-align: right;">${escapeHtml(transaccion.createdAt ? new Date(transaccion.createdAt).toLocaleString('es-CO') : '-')}</td></tr>
            <tr><td style="border-style: hidden; font-weight: bold;">
            
                <img src="cid:${EMAIL_CASH_CID}" width="40" height="16" alt="Kozby" style="border: 0; display: block; " />
            
            </td> <td style="border-style: hidden; "></td><td style="border-style: hidden; text-align: right;">${escapeHtml(String(id))}</td> </tr>
            </tbody>
        </table>
    </div>
    </div>
</body>

</html>`;

};

const buildTransactionText = (transaccion) => {
  const lines = [
    `Recibo: ${transaccion.recibo || 'transacción'} `,
    `Tipo de pago: ${transaccion.tipo_pago || '-'} `,
    `Fecha: ${transaccion.createdAt
      ? new Date(transaccion.createdAt).toLocaleString('es-CO')
      : '-'
    } `,
    `Subtotal: ${formatMoney(transaccion.subtotal)} `,
    `Total: ${formatMoney(transaccion.total)} `,
  ];
  return lines.join('\n');
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Imagen local incrustada vía CID (los clientes de correo no muestran iframes) */
function getMapImageHtml() {
  if (!fs.existsSync(EMAIL_MAP_PATH)) {
    return '';
  }
  return `
        <div style="margin-top: 16px;">
          <a href="https://www.google.com/maps/place/KOZBY+HAIR+SALON/@33.9018866,-84.2062135,17z/data=!4m6!3m5!1s0x88f5a7e32d57b765:0x9fb0b0cab16fafff!8m2!3d33.9018307!4d-84.2063532!16s%2Fg%2F11f5_ktc8n?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <img src="cid:${EMAIL_MAP_CID}" width="375" height="120" alt="Ubicación KOZBY HAIR SALON" style="border: 0; display: block; max-width: 100%; height: auto;" />
          </a>
        </div>`;
}

/** Sustituye cid: por data URI para renderizar el mismo HTML en Puppeteer */
function inlineEmailAssetsIntoHtml(html) {
  let result = html;
  const pairs = [
    [EMAIL_LOGO_CID, EMAIL_LOGO_PATH],
    [EMAIL_MAP_CID, EMAIL_MAP_PATH],
    [EMAIL_CASH_CID, EMAIL_CASH_PATH],
  ];
  for (const [cid, filePath] of pairs) {
    if (fs.existsSync(filePath)) {
      const b64 = fs.readFileSync(filePath).toString('base64');
      result = result.split(`cid:${cid}`).join(`data:image/png;base64,${b64}`);
    }
  }
  return result;
}

const getReciboHtmlForImageExport = (transaccion) =>
  inlineEmailAssetsIntoHtml(buildTransactionHtml(transaccion));

function getMapAttachment() {
  if (!fs.existsSync(EMAIL_MAP_PATH)) {
    return [];
  }
  return [
    {
      filename: 'email_logo.png',
      path: EMAIL_LOGO_PATH,
      cid: EMAIL_LOGO_CID,
    },
    {
      filename: 'email_map.png',
      path: EMAIL_MAP_PATH,
      cid: EMAIL_MAP_CID,
    },
    {
      filename: 'email_cash.png',
      path: EMAIL_CASH_PATH,
      cid: EMAIL_CASH_CID,
    },
  ];
}

const sendTransaccionCorreo = async ({ to, transaccion }) => {
  const from = process.env.MAIL_FROM || process.env.MAIL_USER;
  const transporter = getTransporter();

  const subject = `Recibo Kozby — ${transaccion.recibo || 'transacción'} `;

  await transporter.sendMail({
    from: `"Kozby" <${from}>`,
    to,
    subject,
    text: buildTransactionText(transaccion),
    html: buildTransactionHtml(transaccion),
    attachments: getMapAttachment(),
  });
};

module.exports = {
  sendTransaccionCorreo,
  getReciboHtmlForImageExport,
};
