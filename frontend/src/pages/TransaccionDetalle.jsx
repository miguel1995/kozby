import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { checkToken } from '../utils/authUtils';
import { getTransaccionById } from '../services/transacciones.service';

const TransaccionDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transaccion, setTransaccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState({ codeError: null, isOpen: false });

  const handleOk = () => setErrorData({ codeError: null, isOpen: false });

  useEffect(() => {
    const fetchTransaccion = async () => {
      setLoading(true);
      try {
        checkToken();
        const data = await getTransaccionById(id);
        setTransaccion(data);
      } catch (error) {
        setErrorData({ codeError: error.status || 500, isOpen: true });
        setTransaccion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaccion();
  }, [id]);

  const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleString('es-CO');
  };

  const formatMoney = (value) => {
    return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
  };

  const numeroRecibo = transaccion?.id || '-';

  return (
    <div className="page-container">
      <div className="products-page">
        <div className="products-page-filters-and-actions">
          <div className="products-page-archived-title">Detalle de transacción</div>
          <div
            className="create-article-new"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          >
            Volver
          </div>
        </div>

        {loading ? (
          <Loader message="Cargando transacción..." />
        ) : !transaccion ? (
          <div>No se encontró la transacción.</div>
        ) : (
          <div className="products-table" style={{ padding: 12 }}>
            <div><strong>Método de pago:</strong> {transaccion.tipo_pago || '-'}</div>
            <div><strong>Fecha y hora:</strong> {formatDateTime(transaccion.createdAt)}</div>
            <div><strong>Número de recibo:</strong> {numeroRecibo}</div>

            <hr />

            <div><strong>Productos:</strong> {transaccion.productos_descripcion || '-'}</div>

            <hr />

            <div><strong>Descuento:</strong> {transaccion.descuento?.titulo || '-'}</div>
            <div><strong>Valor descuento:</strong> {formatMoney(transaccion.descuento?.valor || 0)}</div>

            <hr />

            <div><strong>Subtotal:</strong> {formatMoney(transaccion.subtotal)}</div>
            <div><strong>Total:</strong> {formatMoney(transaccion.total)}</div>
          </div>
        )}

        <ModalError open={errorData.isOpen} errorCode={errorData.codeError} onOk={handleOk} />
      </div>
    </div>
  );
};

export default TransaccionDetalle;
