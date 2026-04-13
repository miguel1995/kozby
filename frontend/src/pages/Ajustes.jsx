import { useNavigate } from 'react-router';
import { ButtonClose } from '../components/buttons/ButtonClose';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';

const Ajustes = () => {
  const navigate = useNavigate();

  const handleDescargarTransacciones = () => {
    console.log('Descargando Transaccion');
  };

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
          <ButtonSecundary
            label="Descargar Transacciones"
            onClick={handleDescargarTransacciones}
          />
        </div>
      </div>
    </div>
  );
};

export default Ajustes;
