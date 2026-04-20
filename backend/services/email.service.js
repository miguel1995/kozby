const nodemailer = require('nodemailer');

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
  const id = transaccion.id || '-';
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
    <div style="width: 375px; margin: auto;">
        <div
            style="background-color: #546376; display: flexbox; justify-content: center; padding-top: 20px; height: 50px;">
            <div
                style="background-color: #c0c4c7; border: solid 2 #fff; border-radius: 10%;  height: 50px; margin: auto; width: 50px; position: absolute; margin-left: 225px; margin-top: 20px;">
                IMg</div>

        </div>
        <div style="color: #c0c4c7; margin: auto; width: fit-content; margin-top: 25px; font-weight: bold;">Kozby</div>
        <div style="font-size: 64px;  color: #3d454d; font-weight: 600; padding-top: 32px; display: flex; justify-content: center;">
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
            <tr><td style="border-style: hidden; font-weight: bold;">Tipo de pago</td><td style="border-style: hidden;">${escapeHtml(transaccion.tipo_pago.toUpperCase() || '-')}</td><td style="border-style: hidden; text-align: right; font-weight: bold;"></td></tr>            
            </tbody>
        </table>

        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.5249468147285!2d-84.20621351122001!3d33.901886579828926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5a7e32d57b765%3A0x9fb0b0cab16fafff!2sKOZBY%20HAIR%20SALON!5e0!3m2!1ses-419!2sco!4v1776658884513!5m2!1ses-419!2sco" width="375" height="120" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

         <table border="1" cellpadding="8" cellspacing="0" style="border: none; width: 100%;">
            <thead>
               
            </thead>
            <tbody>            
            <tr><td style="border-style: hidden; ">${escapeHtml(transaccion.tipo_pago.toUpperCase() || '-')}</td> <td style="border-style: hidden;"></td><td style="border-style: hidden; text-align: right;">${escapeHtml(transaccion.createdAt ? new Date(transaccion.createdAt).toLocaleString('es-CO') : '-')}</td></tr>
            <tr><td style="border-style: hidden; font-weight: bold;">Recibo</td> <td style="border-style: hidden; "></td><td style="border-style: hidden; text-align: right;">${escapeHtml(String(id))}</td> </tr>
            </tbody>
        </table>
    </div>
</body>

</html>`;

};

const buildTransactionText = (transaccion) => {
  const lines = [
    `Recibo: ${transaccion.id} `,
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

const sendTransaccionCorreo = async ({ to, transaccion }) => {
  const from = process.env.MAIL_FROM || process.env.MAIL_USER;
  const transporter = getTransporter();

  const subject = `Recibo Kozby — ${transaccion.id || 'transacción'} `;

  await transporter.sendMail({
    from: `"Kozby" < ${from}> `,
    to,
    subject,
    text: buildTransactionText(transaccion),
    html: buildTransactionHtml(transaccion),
  });
};

module.exports = {
  sendTransaccionCorreo,
};
