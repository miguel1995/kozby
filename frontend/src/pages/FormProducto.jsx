import { Modal, Row, Col } from 'antd';
import { useFormProductoHandler } from '../hooks/useFormProductoHandler';
import { useNavigate } from 'react-router';
import { ProductForm } from '../components/ProductForm';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SubmitButton from '../components/SubmitButton';
import { formatDate } from '../utils/dateUtils';
import { useEffect, useState } from 'react';
import { ModalLoader } from '../components/modals/modalLoader';
import { ModalError } from '../components/modals/ModalError';

const FormProducto = ({ isEditMode = false }) => {


  const {
    loading,
    values,
    fechaCreacion,
    fechaModificacion,
    isFormValid,
    isModalOpen,
    handleChange,
    handleSubmit,
    handleOk,
    showFormErrors
  } = useFormProductoHandler(isEditMode);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("error", loading);
  }, [loading]);

  return (
    <>
      <div style={{ position: 'relative' }}>

        <div>
          <div className="form-producto-actions">
            <CloseOutlined
              className="form-producto-close-icon"
              onClick={() => navigate('/productos')}
            />
            <SubmitButton
              text="Guardar"
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>

          {isEditMode ? (
            <>
              <div className="form-producto-title">Editar artículo</div>
              <div className="form-producto-subtitle">
                <span>Artículo creado el {formatDate(fechaCreacion)}</span>
                <span>Última modificación el {formatDate(fechaModificacion)}</span>
              </div>
            </>
          ) : (
            <div className="form-producto-title">Crear artículo</div>
          )}
        </div>

        <div className="form-producto-container">

          {showFormErrors && isFormValid === false && (
            <div className="error-messages">
              <div className="error-messages-title">
                <div><ExclamationCircleOutlined /></div>
                <span>Corrige estos errores para guardar este artículo:</span>
              </div>
              <ul>
                {Object.entries(values).map(field => {
                  if (field[1].error) {
                    return <li key={field[0]}>{field[1].error}</li>;
                  }
                  return null;
                })}
              </ul>
            </div>
          )}

          <Row gutter={[32, 32]} justify="center">
            <Col span={16}>
              <ProductForm
                values={values}
                handleChange={handleChange}
              />
            </Col>
            <Col span={8}>
              <div>Categorías</div>
              <div>En construcción...</div>
            </Col>
          </Row>
        </div>

      </div>

      <ModalError
        open={isModalOpen}
        onOk={handleOk}
      />


      
      <ModalLoader loading={loading} message={isEditMode ? "Guardando cambios..." : "Creando artículo..."} />

    </>
  );
};

export default FormProducto;
