import { useState, useEffect } from 'react';
import { message } from 'antd';
import { postEnviarCorreoTransaccion } from '../services/transacciones.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const usePaymentResult = (transactionId, delay = 1500) => {
  const [loading, setLoading] = useState(true);
  const [receiptOption, setReceiptOption] = useState(null);
  const [emailTo, setEmailTo] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const handleSendEmail = async () => {
    if (!transactionId) {
      message.error('No se encontró la transacción.');
      return;
    }

    const to = emailTo.trim();
    if (!EMAIL_RE.test(to)) {
      message.error('Introduce un correo electrónico válido.');
      return;
    }

    setSendingEmail(true);
    try {
      await postEnviarCorreoTransaccion(transactionId, { to });
      message.success('Correo enviado correctamente.');
      setReceiptOption('email-sent');
    } catch (err) {
      message.error(err?.message || 'No se pudo enviar el correo.');
    } finally {
      setSendingEmail(false);
    }
  };

  return {
    loading,
    receiptOption,
    setReceiptOption,
    emailTo,
    setEmailTo,
    sendingEmail,
    handleSendEmail,
  };
};