import React, { useMemo, useState } from 'react';
import { Input } from 'antd';
import {
  SearchOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import Loader from '../components/Loader';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { ModalError } from '../components/modals/ModalError';
import { useTransaccionHandler } from '../hooks/useTransaccionHandler';
import { useNavigate } from 'react-router-dom';


function Transacciones() {
  const navigate = useNavigate();

  const { transacciones, loading, loadingMore, hasMore, loadMore, errorData, handleOk } = useTransaccionHandler();

  const [search, setSearch] = useState('');



  const formatDayLabel = (value) => {
    if (!value) return 'Sin fecha de creacion';
    return new Date(value).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTimeAmPm = (value) => {
    if (!value) return '--:--';
    return new Date(value).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPaymentIcon = (tipoPago) => {
    const tipo = (tipoPago || '').toLowerCase().trim();


    if (tipo.includes('tarjeta') || tipo.includes('tajeta')) {
      return <CreditCardOutlined className="tx-pay-icon" />;
    }


    if (tipo.includes('efectivo')) {
      return <DollarOutlined className="tx-pay-icon" />;
    }

    if (tipo.includes('zell') || tipo.includes('zelle')) {
      return <span className="tx-pay-icon tx-pay-icon-zelle">Z</span>;
    }

    return null;
  };

  const filteredTransacciones = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return transacciones;

    return transacciones.filter((tx) => {
      const searchable = [
        tx?.tipo_pago,
        tx?.productos_descripcion,
        String(tx?.total ?? ''),
        String(tx?.subtotal ?? ''),
        tx?.createdAt ? new Date(tx.createdAt).toLocaleDateString('es-CO') : '',
        tx?.createdAt ? formatTimeAmPm(tx.createdAt) : '',
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [transacciones, search]);

  const groupedByDay = useMemo(() => {
    return filteredTransacciones.reduce((acc, tx) => {
      const key = tx?.createdAt
        ? new Date(tx.createdAt).toLocaleDateString('en-CA')
        : 'sin-fecha';

      if (!acc[key]) {
        acc[key] = {
          label: formatDayLabel(tx?.createdAt),
          items: [],
        };
      }

      acc[key].items.push(tx);
      return acc;
    }, {});
  }, [filteredTransacciones]);

  return (
    <div className="page-container">
      <div className="products-page">
        <div className="products-page-filters-and-actions">
          <div className="products-page-archived-title">Transacciones</div>
          <Input
            placeholder="Buscar"
            className="products-page-search-input"

            prefix={<SearchOutlined />}
            suffix={search ? <CloseOutlined onClick={() => setSearch('')} /> : null}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="products-table">
          {loading ? (
            <Loader message="Cargando transacciones..." />
          ) : Object.keys(groupedByDay).length === 0 ? (
            <div>No hay transacciones para mostrar.</div>
          ) : (
            Object.entries(groupedByDay).map(([dayKey, group]) => (
              <div key={dayKey} className="tx-day-group">
                <div className="tx-day-title">{group.label}</div>

                {group.items.map((tx) => (
                  <div
                    key={tx.id}
                    className="tx-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/transacciones/${tx.id}`)}
                  >

                    <div className="tx-item-content">
                      <div className="tx-item-total-and-time">
                        <div className="tx-total-left">
                          {getPaymentIcon(tx.tipo_pago)}
                          <div className="tx-item-total">
                            $ {Number(tx.total || 0).toLocaleString('es-CO')}

                          </div>
                        </div>
                        <div className="tx-item-time">{formatTimeAmPm(tx.createdAt)}</div>
                      </div>

                      <div className="tx-item-title">{tx.productos_descripcion || '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {!loading && hasMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <ButtonSecundary onClick={loadMore} label="Cargar más" />
          </div>
        )}



        <ModalError
          open={errorData.isOpen}
          errorCode={errorData.codeError}
          onOk={handleOk}
        />
      </div>
    </div>
  );
}

export default Transacciones;
