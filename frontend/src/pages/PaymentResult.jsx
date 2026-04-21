import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin, Button, Input } from 'antd';
import { usePaymentResult } from '../hooks/usePaymentResult';
import { useParams, useNavigate } from 'react-router-dom';
import { SubmitButton } from '../components/buttons/SubmitButton';

const PaymentResult = () => {
  const navigate = useNavigate();
  const { transactionId } = useParams();

  const {
    loading,
    receiptOption,
    emailTo,
    setEmailTo,
    sendingEmail,
    handleSendEmail,
  } = usePaymentResult(transactionId, 1500);

  if (loading) {
    return (
      <div className="payment-result">
        <div className="payment-result__loader">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p>Registrando</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-page">
      <div className="payment-result__page-header">
        <Button
          type="text"
          onClick={() => navigate('/proceso-pagos')}
          className="payment-result__new-sale-button"
        >
          <span>Venta nueva</span>
        </Button>
      </div>

      <div className="payment-result">
        <div className="payment-result__success">
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
          <h2>Registrado</h2>
          <p>¿Cómo desea obtener el recibo?</p>

          <div className="payment-result__actions">
            <SubmitButton
              onClick={() => navigate('/proceso-pagos')}
              text="Sin recibo"
              style={{ minWidth: 240 }}
            />
          </div>

          {!transactionId && (
            <p style={{ color: '#fa541c', marginTop: 16 }}>
              No se encontró el ID de transacción. Vuelve a realizar el pago o regresa al inicio.
            </p>
          )}

          <div className="payment-result__email-send">
            <Input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="Correo electrónico"
            />
            <SubmitButton
              onClick={handleSendEmail}
              loading={sendingEmail}
              text="Enviar recibo"
              style={{ minWidth: 160 }}
            />
          </div>

          {receiptOption === 'none' && <p>No se generará recibo.</p>}
          {receiptOption === 'email-sent' && <p>Recibo enviado correctamente.</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;