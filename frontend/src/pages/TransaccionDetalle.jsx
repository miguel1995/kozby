import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Modal, message } from 'antd';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { useTransaccionDetalleHandler } from '../hooks/useTransaccionDetalleHandler';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { postEnviarCorreoTransaccion } from '../services/transacciones.service';
import { ArrowLeftOutlined, CreditCardOutlined, DollarOutlined, FileTextOutlined, TagOutlined } from '@ant-design/icons';





const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TransaccionDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { transaccion, loading, errorData, handleOk } = useTransaccionDetalleHandler(id);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleOpenEmailModal = () => {
    setEmailTo('');
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    const to = emailTo.trim();
    if (!EMAIL_RE.test(to)) {
      message.error('Introduce un correo electrónico válido.');
      return;
    }
    setSendingEmail(true);
    try {
      await postEnviarCorreoTransaccion(id, { to });
      message.success('Correo enviado correctamente.');
      setEmailModalOpen(false);
    } catch (err) {
      message.error(err?.message || 'No se pudo enviar el correo.');
    } finally {
      setSendingEmail(false);
    }
  };

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
  const descuentos = Array.isArray(transaccion?.descuentos) ? transaccion.descuentos : [];

  return (
    <div className="page-container">
      <div className="products-page">
        <div className="products-page-filters-and-actions">
          <div className="txd-topbar">
            <div className="txd-back-row">
              <button
                type="button"
                className="txd-back-btn"
                onClick={() => navigate(-1)}
                aria-label="Volver"
              >
                <ArrowLeftOutlined />

              </button>

              <div className="txd-back-title">
                Venta de <strong>{transaccion ? formatMoney(transaccion.total) : '-'}</strong>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader message="Cargando transacción..." />
        ) : !transaccion ? (
          <div>No se encontró la transacción.</div>
        ) : (
          <div>
            <div className="txd-email-row" style={{ padding: '0 12px 12px' }}>
              <ButtonSecundary onClick={handleOpenEmailModal} label="Enviar correo" />
            </div>

            <Modal
              title="Enviar detalle por correo"
              open={emailModalOpen}
              onOk={handleSendEmail}
              onCancel={() => !sendingEmail && setEmailModalOpen(false)}
              okText="Enviar"
              cancelText="Cancelar"
              confirmLoading={sendingEmail}
              destroyOnClose
            >
              <p style={{ marginBottom: 8 }}>Correo del destinatario:</p>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                onPressEnter={handleSendEmail}
                autoComplete="email"
              />
            </Modal>

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
              <div className="txd-col-stack">
                <strong className="txd-col-main">Número de recibo</strong>
                <span className="txd-receipt"><strong>{numeroRecibo}</strong></span>
              </div>


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
              {descuentos.map((d, idx) => (
                <div key={`${d?.id || 'descuento'}-${idx}`} className="txd-products-row txd-totals-row">
                  <div className="txd-products-badge">
                    <TagOutlined className="txd-icon" />
                  </div>
                  <div className="txd-totals-label">{d?.nombre || 'Descuento'}</div>
                  <div className="txd-totals-value">- {' '}
                    {d?.tipo === 'PORCENTAJE' ? `${d?.monto}%` : `$${d?.monto}`} 
                    </div>
                </div>
              ))}

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


          </div>
          </div>
        )}

        <ModalError open={errorData.isOpen} errorCode={errorData.codeError} onOk={handleOk} />
      </div>
    </div>
  );
};

export default TransaccionDetalle;
