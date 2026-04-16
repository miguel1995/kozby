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
        `<tr><td>${escapeHtml(p.producto_nombre || '-')}</td><td>${escapeHtml(
          String(p.variante_nombre || '')
        )}</td><td>${p.cantidad ?? 1}</td><td>${formatMoney(
          (Number(p.precio) || 0) * (Number(p.cantidad) || 1)
        )}</td></tr>`
    )
    .join('');

  const descRows = descuentos
    .map((d) => {
      const val =
        (d?.tipo || '').toUpperCase() === 'PORCENTAJE'
          ? `${d?.monto ?? '-'}%`
          : formatMoney(d?.monto);
      return `<tr><td>${escapeHtml(d?.nombre || 'Descuento')}</td><td>${escapeHtml(
        d?.tipo || ''
      )}</td><td>- ${val}</td></tr>`;
    })
    .join('');

  return `
  
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
</head>

<body style="font-family: system-ui, sans-serif; background-color: #f3f4f6; display: flexbox; justify-content: center; ">
    <div style="width: 500px; margin: auto; background-color: #ffffff;">
        <div
            style="background-color: #546376; display: flexbox; justify-content: center; padding-top: 20px; height: 50px;">
            <div
                style="background-color: #c0c4c7; border: solid 2 #fff; border-radius: 10%;  height: 50px; margin: auto; width: 50px; position: absolute; margin-left: 225px; margin-top: 20px;">
                IMg</div>

        </div>
        <div style="color: #c0c4c7; margin: auto; width: fit-content; margin-top: 25px; font-weight: bold;">Kosby</div>
        <div style="font-size: 64px; line-height: 31px; color: #3d454d; font-weight: 500px; text-align: center; margin: auto; margin-bottom: 32px; margin-top: 64px;">
            ${formatMoney(transaccion.total)}</p>
        </div>
<div style="border-bottom: 1px solid #c0c4c7; margin-bottom: 32px;"/>
        <p><strong>Recibo n.°</strong> ${escapeHtml(String(id))}</p>
        <p><strong>Tipo de pago:</strong> ${escapeHtml(transaccion.tipo_pago || '-')}</p>
        <p><strong>Fecha:</strong> ${escapeHtml(
            transaccion.createdAt ? new Date(transaccion.createdAt).toLocaleString('es-CO') : '-'
            )}</p>
        <h3>Productos</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Variante</th>
                    <th>Cant.</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>${productosRows || '<tr><td colspan="4">Sin productos</td></tr>'}</tbody>
        </table>
        ${descuentos.length ? `<h3>Descuentos</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>${descRows}</tbody>
        </table>`
        : ''
        }
        <p><strong>Subtotal:</strong> ${formatMoney(transaccion.subtotal)}</p>

    </div>
</body>

</html>`;
};

const buildTransactionText = (transaccion) => {
  const lines = [
    `Recibo: ${transaccion.id}`,
    `Tipo de pago: ${transaccion.tipo_pago || '-'}`,
    `Fecha: ${
      transaccion.createdAt
        ? new Date(transaccion.createdAt).toLocaleString('es-CO')
        : '-'
    }`,
    `Subtotal: ${formatMoney(transaccion.subtotal)}`,
    `Total: ${formatMoney(transaccion.total)}`,
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

  const subject = `Recibo Kozby — ${transaccion.id || 'transacción'}`;

  await transporter.sendMail({
    from: `"Kozby" <${from}>`,
    to,
    subject,
    text: buildTransactionText(transaccion),
    html: buildTransactionHtml(transaccion),
  });
};

module.exports = {
  sendTransaccionCorreo,
};
