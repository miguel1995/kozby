import { Modal, Row, Col } from 'antd';
import { useFormProductoHandler } from '../hooks/useFormProductoHandler';
import { useNavigate } from 'react-router';
import { ProductForm } from '../components/ProductForm';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SubmitButton from '../components/SubmitButton';
import { formatDate } from '../utils/dateUtils';

const FormProducto = ({ isEditMode = false }) => {

  const { values,
    fechaCreacion,
    fechaModificacion,
    isFormValid,
    isModalOpen,
    handleChange,
    handleSubmit,
    handleOk,
    showFormErrors } = useFormProductoHandler(isEditMode);

  const navigate = useNavigate();


  console.log(values);

  return (
    <>
      <div>
        <div className="form-producto-actions">
          <CloseOutlined
            className="form-producto-close-icon"
            onClick={() => navigate('/productos')}
          />
          <SubmitButton text="Guardar" onClick={handleSubmit} />
        </div>
        {isEditMode ? 
        <>
          <div className="form-producto-title">Editar artículo</div>
          <div className="form-producto-subtitle">
            <span>Artículo creado el {formatDate(fechaCreacion)}</span>
            <span>Última modificación el {formatDate(fechaModificacion)}</span>
          </div>
        </>
        : <div className="form-producto-title">Crear artículo</div>}

       

      </div>
      <div className="form-producto-container">

      {
        showFormErrors && isFormValid===false &&
          <div className="error-messages">
            <div className="error-messages-title">
              <div> <ExclamationCircleOutlined /></div>
              <span>Corrige estos errores para guardar este artículo:</span>
            </div>
            <ul>
            {Object.values(values).map(field => {
              if (field.error) {
                return <li key={field.name}>{field.error}</li>
              }
            })}
            </ul>
          </div>
          }

          <ProductForm values={values} handleChange={handleChange} />
          <Variantes variantes={values.variantes} handleChange={handleChange} />

       
      </div>
      <Modal
        title="Fuera de servicio"
        closable={false}
        open={isModalOpen}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Lo sentimos, en este momento el servicio no esta disponible</p>
        <p>Por Favor intentelo mas tarde</p>
      </Modal>
    </>
  );
};

export default FormProducto;
