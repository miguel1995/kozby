import { useMemo, useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { useDescuentosHandler } from '../hooks/useDescuentosHandler';
import { Divider } from 'antd';
function Descuentos() {
  const { descuentos, loading, errorData, handleOk } = useDescuentosHandler();
  const [search, setSearch] = useState('');

  const filteredDescuentos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return descuentos;

    return descuentos.filter((d) => {
      const searchable = [d?.nombre, d?.tipo, String(d?.monto ?? '')]
        .join(' ')
        .toLowerCase();
      return searchable.includes(term);
    });
  }, [descuentos, search]);

  const formatMonto = (d) => {
    const raw = d?.monto;
    if (raw == null || raw === '') return '—';
    const num = Number(raw);
    if (Number.isNaN(num)) return String(raw);
    if ((d?.tipo || '').toUpperCase() === 'PORCENTAJE') {
      return `${num.toLocaleString('es-CO', { maximumFractionDigits: 2 })} %`;
    }
    return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="page-container">
      <div className="products-page">
        <div className="products-page-filters-and-actions">
          <div className="products-page-archived-title">Descuentos</div>
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
            <Loader message="Cargando descuentos..." />
          ) : filteredDescuentos.length === 0 ? (
            <div>No hay descuentos para mostrar.</div>
          ) : (
            <div className="descuentos-list">
              {filteredDescuentos.map((d) => (
                <div key={d.id}>
                <div className="descuento-item">
                  <div className="descuento-item-main">
                    <div className="descuento-item-nombre">{d.nombre || '—'}</div>
                  </div>
                  <div className="descuento-item-monto">{formatMonto(d)}</div>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <ModalError open={errorData.isOpen} errorCode={errorData.codeError} onOk={handleOk} />
      </div>
    </div>
  );
}

export default Descuentos;
