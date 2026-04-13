import { useNavigate } from 'react-router';
import { Button } from 'antd';
import { ButtonClose } from '../components/buttons/ButtonClose';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { useTransaccionesExcelDownload } from '../hooks/useTransaccionesExcelDownload';

const Ajustes = () => {
  const navigate = useNavigate();
  const {
    loading,
    desdeYmd,
    hastaYmd,
    setDesdeYmd,
    setHastaYmd,
    applyPresetUltimoDia,
    applyPresetSemana,
    applyPresetMes,
    downloadExcel,
  } = useTransaccionesExcelDownload();

  return (
    <div className="page-container">
      <div className="products-page">
        <div className="products-page-filters-and-actions">
          <div className="descuentos-page-header">
            <ButtonClose onClick={() => navigate('/mas')} />
            <div className="products-page-archived-title">Ajustes</div>
            <span className="ajustes-header-spacer" aria-hidden />
          </div>
        </div>

        <div className="ajustes-content">
          <div className="ajustes-export-block">
            <h3 className="ajustes-export-title">Exportar transacciones (Excel)</h3>
            <p className="ajustes-export-hint">
              Elija un rango de fechas o use un atajo. Si deja las fechas vacías, se exportan{' '}
              <strong>todas</strong> las transacciones (puede ser lento con muchos datos).
            </p>

            <div className="ajustes-presets">
              <span className="ajustes-presets-label">Atajos:</span>
              <Button size="small" onClick={applyPresetUltimoDia} disabled={loading}>
                {'\u00DAltimo d\u00EDa'}
              </Button>
              <Button size="small" onClick={applyPresetSemana} disabled={loading}>
                {'\u00DAltima semana'}
              </Button>
              <Button size="small" onClick={applyPresetMes} disabled={loading}>
                {'\u00DAltimo mes'}
              </Button>
            </div>

            <div className="ajustes-date-row">
              <label className="ajustes-date-field">
                <span>Desde</span>
                <input
                  type="date"
                  value={desdeYmd}
                  onChange={(e) => setDesdeYmd(e.target.value)}
                  disabled={loading}
                />
              </label>
              <label className="ajustes-date-field">
                <span>Hasta</span>
                <input
                  type="date"
                  value={hastaYmd}
                  onChange={(e) => setHastaYmd(e.target.value)}
                  disabled={loading}
                />
              </label>
            </div>

            <ButtonSecundary
              label="Descargar Transacciones"
              onClick={downloadExcel}
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ajustes;
