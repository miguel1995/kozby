import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { useTransaccionDetalleHandler } from '../hooks/useTransaccionDetalleHandler';
import { CreditCardOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';





const TransaccionDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { transaccion, loading, errorData, handleOk } = useTransaccionDetalleHandler(id);

  const formatTipoPago = (value) => {
    if (!value) return '-';
    const text = String(value).toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  };


  const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleString('es-CO');
  };

  const getPaymentIcon = (tipoPago) => {
    const tipo = (tipoPago || '').toLowerCase().trim();


    if (tipo.includes('tarjeta') || tipo.includes('tajeta')) {
      return <CreditCardOutlined className="txd-pay-icon" />;
    }


    if (tipo.includes('efectivo')) {
      return <DollarOutlined className="txd-pay-icon" />;
    }

    if (tipo.includes('zell') || tipo.includes('zelle')) {
      return <span className="txd-pay-icon txd-pay-icon-zelle">Z</span>;
    }

    return null;
  };

  const formatMoney = (value) => {
    return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
  };

  const productos = Array.isArray(transaccion?.productos) ? transaccion.productos : [];
  const getIniciales = (nombre = '') => nombre.trim().slice(0, 2).toUpperCase();


  const numeroRecibo = transaccion?.id || '-';

  return (
    <div className="page-container">
      <div className="products-page">
        <div className="products-page-filters-and-actions">
          


        </div>

        {loading ? (
          <Loader message="Cargando transacción..." />
        ) : !transaccion ? (
          <div>No se encontró la transacción.</div>
        ) : (
          <div className="products-table" style={{ padding: 12 }}>
            <div><strong>TIPO DE PAGO: {transaccion.tipo_pago || '-'}</strong></div>
            <div className="txd-date">{formatDateTime(transaccion.createdAt)}</div>

            <hr />

            <div className="txd-threecol">
              <span className="txd-col-icon">{getPaymentIcon(transaccion.tipo_pago)}</span>
              <strong className="txd-col-main">{formatTipoPago(transaccion.tipo_pago)}</strong>
              <span className="txd-total">{formatMoney(transaccion.total)}</span>
            </div>

            <hr />
            <div className="txd-threecol">
              <span className="txd-col-icon">
                <FileTextOutlined className="txd-icon" />
              </span>
              <strong className="txd-col-main">Número de recibo</strong>
              <span className="txd-receipt"><strong>{numeroRecibo}</strong></span>

            </div>




            <hr />

            <div className="txd-products">
              <div><strong>PEDIDO: Recibo n.° {numeroRecibo}</strong></div>

              {productos.length === 0 ? (
                <div>-</div>
              ) : (
                <div className="txd-products-table">
                  {productos.map((p, idx) => (
                    <div
                      className="txd-products-row"
                      key={`${p.producto_id ?? 'p'}-${p.variante_id ?? 'v'}-${idx}`}
                    >
                      <div className="txd-products-badge">{getIniciales(p.producto_nombre || '')}</div>

                      <div className="txd-products-name">
                        <div className="txd-products-main">
                          <span className="txd-products-title">{p.producto_nombre || '-'}</span>
                          <span className="txd-products-qty">{` x ${(p.cantidad ?? 1)}`}</span>
                        </div>


                        {p.variante_nombre ? (
                          <div className="txd-products-variant">{p.variante_nombre}</div>
                        ) : null}
                      </div>

                      <div className="txd-products-price">
                        {formatMoney((Number(p.precio) || 0) * (Number(p.cantidad) || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>



            <hr />

            <strong className="txd-col-total">Total</strong>
            <div className="txd-totals-table">
              <div className="txd-products-row txd-totals-row">
                <div className="txd-products-badge">
                  <FileTextOutlined className="txd-icon" />
                </div>
                <div className="txd-totals-label">Subtotal</div>
                <div className="txd-totals-value">{formatMoney(transaccion.subtotal)}</div>
              </div>

              <div className="txd-products-row txd-totals-row">
                <div className="txd-products-badge">
                  <FileTextOutlined className="txd-icon" />
                </div>
                <div className="txd-totals-label">Total</div>
                <div className="txd-totals-value">{formatMoney(transaccion.total)}</div>
              </div>
            </div>







            <hr />

            <div><strong>Descuento:</strong> {transaccion.descuento?.titulo || '-'}</div>
            <div><strong>Valor descuento:</strong> {formatMoney(transaccion.descuento?.valor || 0)}</div>

          </div>
        )}

        <ButtonSecundary label="Volver" onClick={() => navigate(-1)} />
        <ModalError open={errorData.isOpen} errorCode={errorData.codeError} onOk={handleOk} />
      </div>
    </div>
  );
};

export default TransaccionDetalle;
