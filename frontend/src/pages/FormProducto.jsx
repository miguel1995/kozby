import { Input, Button, Modal, Row, Col } from 'antd';
import FloatLabel from '../components/FloatLabel';
import { useState, useEffect } from 'react';
import { useFormProductoHandler } from '../hooks/useFormProductoHandler';
import { useNavigate } from 'react-router';
import { ProductForm } from '../components/ProductForm';
import { CloseOutlined } from '@ant-design/icons';
import SubmitButton from '../components/SubmitButton';

const FormProducto = ({ isEditMode = false }) => {

  const { values,
    isFormValid,
    isModalOpen,
    handleChange,
    handleSubmit,
    handleOk } = useFormProductoHandler(isEditMode);

  const navigate = useNavigate();

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
        {isEditMode ? <div className="form-producto-title">Editar artículo</div> : <div className="form-producto-title">Crear artículo</div>}
        {/*<div className="error-messages">
        Corrige estos errores para guardar este artículo:
        <div>Ingresa el nombre del artículo</div>
        <div>Ingresa el precio del artículo</div>
        <div>Ingresa la descripción del artículo</div>
        <div>Ingresa la imagen del artículo</div>
      </div>*/}
      </div>
      <div className="form-producto-container">
        <Row
          gutter={[32, 32]}
          justify="center"
        >
          <Col span={16}>
            <ProductForm values={values} handleChange={handleChange} />
          </Col>
          <Col span={8}>
            <div>Categorías</div>
            <div>En construcción...</div>
          </Col>

        </Row>
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
