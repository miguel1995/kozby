import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox, message, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { useTransaccionDetalleHandler } from '../hooks/useTransaccionDetalleHandler';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { postReembolso } from '../services/reembolso.service';
import { getReembolsosPorTransaccion } from '../services/reembolsos.service';
import { CheckCircleTwoTone } from '@ant-design/icons';

const { Title } = Typography;

const Reembolso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transaccion, loading, errorData, handleOk } = useTransaccionDetalleHandler(id);
  const [tipoReembolso, setTipoReembolso] = useState(null); // 'articulos' | 'monto'
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [montoReembolso, setMontoReembolso] = useState('');
  const [processing, setProcessing] = useState(false);
  const productos = Array.isArray(transaccion?.productos) ? transaccion.productos : [];
  const [reembolsos, setReembolsos] = useState([]);
  const [reembolsadosKeys, setReembolsadosKeys] = useState([]);
  const [totalPorDevolver, setTotalPorDevolver] = useState(0);


  useEffect(() => {
    if (!id) return;
    getReembolsosPorTransaccion(id)
      .then((data) => setReembolsos(data))
      .catch(() => setReembolsos([]));

      setTotalPorDevolver(transaccion?.total || 0);
  }, [id, transaccion]);

  useEffect(() => {
    if (transaccion && reembolsos.length > 0){
    let totalReembolsados = 0;
    reembolsos.forEach((r) => {
      if (r.tipo === 'articulos' && Array.isArray(r.articulosDevueltos)) {
        r.articulosDevueltos.forEach((item) => {
          console.log(">> AAAAA ", Number(mostrarDescuentos(item.precio * item.cantidad)));

          totalReembolsados +=  Number(mostrarDescuentos(item.precio * item.cantidad));
        });
      } else if (r.tipo === 'monto') {
        console.log(">> BBBBB ", r.montoDevuelto);
        totalReembolsados += Number(r.montoDevuelto);
      }
    });

    console.log(">> CCCCC ", totalReembolsados);
    console.log(">> DDDDD ", transaccion.total - totalReembolsados);

    setTotalPorDevolver(transaccion.total - totalReembolsados);
    }
  }, [reembolsos]);


  useEffect(() => {
    const keys = [];
    const productosMarcados = productos.map((p, idx) => ({ ...p, _idx: idx, _reembolsado: false }));
    reembolsos.forEach((r) => {
      if (r.tipo === 'articulos' && Array.isArray(r.articulosDevueltos)) {
        r.articulosDevueltos.forEach((item) => {
          let cantidad = item.cantidad || 1;
          for (let i = 0; i < cantidad; i++) {
            const idxProd = productosMarcados.findIndex(
              (p) => !p._reembolsado && p.producto_id === item.producto_id && p.variante_id === item.variante_id
            );
            if (idxProd !== -1) {
              productosMarcados[idxProd]._reembolsado = true;
              keys.push(`${productosMarcados[idxProd].producto_id ?? 'p'}-${productosMarcados[idxProd].variante_id ?? 'v'}-${productosMarcados[idxProd]._idx}`);
            }
          }
        });
      }
    });
    setReembolsadosKeys(keys);

    console.log(productos);

  }, [productos, reembolsos]);


  const getItemKey = (item, idx) => `${item?.producto_id ?? 'p'}-${item?.variante_id ?? 'v'}-${idx}`;

  const handleSelectAll = (checked) => {
    setSelectedItemKeys(
      checked
        ? productos
          .map((item, idx) => getItemKey(item, idx))
          .filter((key) => !reembolsadosKeys.includes(key))
        : []
    );
  };


  const handleSelectItem = (itemKey, checked) => {
    setSelectedItemKeys((prev) => (
      checked ? Array.from(new Set([...prev, itemKey])) : prev.filter((key) => key !== itemKey)
    ));
  };

  const handleProcesarReembolso = async () => {
    if (tipoReembolso === 'articulos') {


      if (selectedItemKeys.length === 0) {
        message.error('Selecciona al menos un artículo.');
        return;
      }
      if (selectedItemKeys.length > 0) {

        const articulosSeleccionados = productos.filter((item, idx) => selectedItemKeys.includes(getItemKey(item, idx)));
        const totalArticulosSeleccionados = articulosSeleccionados.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        const totalDescuentos = mostrarDescuentos(totalArticulosSeleccionados);
        if (totalDescuentos > totalPorDevolver) {
          message.error(`El monto máximo a devolver es $${totalPorDevolver.toFixed(2)}`);
          return;
        }
      }
    }
    if (tipoReembolso === 'monto') {
      
      if (!montoReembolso || isNaN(montoReembolso) || Number(montoReembolso) <= 0) {
        message.error('Ingresa un monto válido.');
        return;
      }
      if (Number(montoReembolso) > totalPorDevolver) {
        message.error(`El monto máximo a devolver es $${totalPorDevolver.toFixed(2)}`);
        return;
      }
    }
    setProcessing(true);
    try {
      const articulosDevueltos = tipoReembolso === 'articulos'
        ? productos.filter((item, idx) => selectedItemKeys.includes(getItemKey(item, idx)))
        : [];

      await postReembolso(id, {
        tipo: tipoReembolso,
        articulosDevueltos,
        montoDevuelto: tipoReembolso === 'monto' ? Number(montoReembolso) : 0,
      });
      message.success('Reembolso procesado correctamente.');
      navigate(`/transacciones/${id}?r=${Date.now()}`, { replace: true });
    } catch (err) {
      message.error(err?.message || 'No se pudo procesar el reembolso.');
    } finally {
      setProcessing(false);
    }
  };

  const mostrarDescuentos = (totalItem) => {
    let descuentos = Number(totalItem);

    console.log("descuentos", descuentos);
    if(transaccion?.descuentos.length > 0){
      transaccion?.descuentos.forEach((d) => {
        if(d.tipo === 'PORCENTAJE'){
          console.log("descuento porcentaje", (totalItem * d.monto / 100));
          descuentos -= (totalItem * d.monto / 100);
        }else{
          console.log("d.monto", d.monto);
          console.log("transaccion?.total", transaccion?.subtotal);
          const porcentajeImporte = ( (d.monto * 100) / transaccion?.subtotal);

          console.log("porcentajeImporte", porcentajeImporte);

          console.log("descuento importe", (totalItem * porcentajeImporte/100));
          descuentos -=  (totalItem * porcentajeImporte/100);
        }
      });
    }
    return descuentos.toFixed(2);
  }

  return (
    <div className="page-container">
      <div className="products-page reembolso-page">
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
                <Title level={5} style={{ margin: 0 }}>Emitir reembolso</Title>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader message="Cargando transacción..." />
        ) : !transaccion ? (
          <div style={{ padding: 12 }}>No se encontró la transacción.</div>
        ) : (
          <div className="products-table reembolso-content" style={{ padding: 12 }}>
            <div className="reembolso-toggle-row">
              <Button
                type="default"
                onClick={() => setTipoReembolso('articulos')}
                className={`reembolso-toggle-btn ${tipoReembolso === 'articulos' ? 'reembolso-toggle-btn--active' : ''}`}
              >
                Por artículos
              </Button>
              <Button
                type="default"
                onClick={() => setTipoReembolso('monto')}
                className={`reembolso-toggle-btn ${tipoReembolso === 'monto' ? 'reembolso-toggle-btn--active' : ''}`}
              >
                Por monto
              </Button>
            </div>

            {tipoReembolso === 'articulos' && (
              <div className="reembolso-panel">
                <p style={{ marginBottom: 8 }}>
                  Selecciona los artículos a devolver (máx: ${totalPorDevolver.toFixed(2)}):
                </p>

                <Checkbox
                  checked={selectedItemKeys.length === productos.length && productos.length > 0}
                  indeterminate={selectedItemKeys.length > 0 && selectedItemKeys.length < productos.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  Seleccionar todos
                </Checkbox>

                <div className="reembolso-items">
                  {/* Artículos disponibles para reembolso */}
                  {productos.filter((item, idx) => !reembolsadosKeys.includes(getItemKey(item, idx))).length > 0 ? (
                    productos.map((item, idx) => {
                      const itemKey = getItemKey(item, idx);
                      if (reembolsadosKeys.includes(itemKey)) return null;
                      return (
                        <div key={itemKey} className="reembolso-item-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Checkbox
                            checked={selectedItemKeys.includes(itemKey)}
                            onChange={(e) => handleSelectItem(itemKey, e.target.checked)}
                            className="reembolso-item-checkbox"
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                            <span>
                              {item.producto_nombre} {item.variante_nombre ? `(${item.variante_nombre})` : ''} x{item.cantidad}
                            </span>
                            <span>
                              ${mostrarDescuentos( item.precio * item.cantidad)}
                            </span>
                            </div>
                          </Checkbox>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: '#888', marginBottom: 8 }}>No hay artículos disponibles para reembolso.</div>
                  )}


                  {productos.filter((item, idx) => reembolsadosKeys.includes(getItemKey(item, idx))).length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>Artículos reembolsados</div>
                      {productos.map((item, idx) => {
                        const itemKey = getItemKey(item, idx);
                        if (!reembolsadosKeys.includes(itemKey)) return null;
                        return (
                          <div key={itemKey} className="reembolso-item-row" style={{ display: 'flex', flexDirection: 'column', gap: 2, opacity: 0.85, borderBottom: '1px solid #eee', marginBottom: 8, paddingBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 500 }}>
                                {item.producto_nombre} {item.variante_nombre ? `(${item.variante_nombre})` : ''} x{item.cantidad}
                              </span>
                              <CheckCircleTwoTone twoToneColor="#52c41a" title="Artículo ya reembolsado" />
                            </div>
                            <div style={{ fontSize: 13, color: '#555', marginLeft: 24 }}>
                              Precio unitario: ${item.precio ?? '-'}<br />                           
                              Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                              {item.cupon || item.descuento || (item.cupones && item.cupones.length > 0) ? (
                                <div style={{ marginTop: 2 }}>
                                  {item.cupon && <span> Cupón: <b>{item.cupon}</b> </span>}
                                  {item.descuento && <span> Descuento: <b>{item.descuento}</b> </span>}
                                  {item.cupones && item.cupones.length > 0 && (
                                    <span> Cupones: <b>{item.cupones.join(', ')}</b> </span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tipoReembolso === 'monto' && (
              <div className="reembolso-panel">
                <p style={{ marginBottom: 8 }}>
                  Ingresa el monto a devolver (máx: ${totalPorDevolver.toFixed(2)}):
                </p>
                <Input
                  type="number"
                  value={montoReembolso}
                  onChange={(e) => setMontoReembolso(e.target.value)}
                  min={1}
                  max={Number(transaccion?.total || 0)}
                  placeholder="Monto a devolver"
                />
              </div>
            )}

            <div className="reembolso-actions">
              <SubmitButton
                text="Confirmar reembolso"
                onClick={handleProcesarReembolso}
                disabled={!tipoReembolso || processing}
                style={{ width: '100%' }}
              />
              <div style={{ marginTop: 8 }}>
                <ButtonSecundary label="Cancelar" onClick={() => navigate(-1)} disabled={processing} />
              </div>
            </div>
          </div>
        )}

        <ModalError open={errorData?.isOpen} errorCode={errorData?.codeError} onOk={handleOk} />
      </div>
    </div>
  );
};

export default Reembolso;
