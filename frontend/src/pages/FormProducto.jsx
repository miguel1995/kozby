import { Input, Button, Modal } from 'antd';
import FloatLabel from '../components/FloatLabel';
import { useState, useEffect } from 'react';
import { useFormProductoHandler } from '../hooks/useFormProductoHandler'; 
import { useNavigate } from 'react-router';
import { ProductForm } from '../components/ProductForm';
  
const FormProducto = ({ isEditMode = false }) => {

  const { values, 
    isFormValid, 
    isModalOpen, 
    handleChange, 
    handleSubmit, 
    handleOk } = useFormProductoHandler(isEditMode);

  const navigate = useNavigate();

  console.log('isEditMode', isEditMode);
  

  return (
    <>
    <div>        
      <Button onClick={() => navigate('/productos')}>Volver</Button>
      <Button disabled={!isFormValid} onClick={handleSubmit}>Guardar</Button>
      {isEditMode ? <div>Editar artículo</div> : <div>Crear artículo</div>}      
      {/*<div className="error-messages">
        Corrige estos errores para guardar este artículo:
        <div>Ingresa el nombre del artículo</div>
        <div>Ingresa el precio del artículo</div>
        <div>Ingresa la descripción del artículo</div>
        <div>Ingresa la imagen del artículo</div>
      </div>*/}
    </div>

    <ProductForm values={values} handleChange={handleChange} />

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
