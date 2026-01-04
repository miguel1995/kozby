import { Input, Button, Modal } from 'antd';
import FloatLabel from '../components/FloatLabel';
import { useState, useEffect } from 'react';
import { useNuevoProductoHandler } from '../hooks/useNuevoProductoHandler'; 
import { useNavigate } from 'react-router';
  
const NuevoProducto = () => {

  const { values, handleChange, handleSubmit, isFormValid, isModalOpen, handleOk } = useNuevoProductoHandler();

  const navigate = useNavigate();

  return (
    <>
    <div>        
      <Button onClick={() => navigate('/productos')}>Volver</Button>
      <Button disabled={!isFormValid} onClick={handleSubmit}>Guardar</Button>
      <div>Crear artículo</div>
      {/*<div className="error-messages">
        Corrige estos errores para guardar este artículo:
        <div>Ingresa el nombre del artículo</div>
        <div>Ingresa el precio del artículo</div>
        <div>Ingresa la descripción del artículo</div>
        <div>Ingresa la imagen del artículo</div>
      </div>*/}
    </div>
      <div className="example">

        <FloatLabel label="Nombre" name="nombre" value={values.nombre.value}>
          <Input value={values.nombre.value} name="nombre" onChange={(e) => handleChange(e)} />
        </FloatLabel>
        <FloatLabel label="Precio" name="precio" value={values.precio.value}>
          <Input value={values.precio.value} name='precio' onChange={e => handleChange(e)} />
        </FloatLabel>
        <FloatLabel label="Descripcion" name="descripcion" value={values.descripcion.value}>
          <Input value={values.descripcion.value} name="descripcion" onChange={e => handleChange(e)} />
        </FloatLabel>
        <FloatLabel label="Imagen" name="imagen" value={values.imagen}>
          <Input value={values.imagen.value} name="imagen" onChange={e => handleChange(e)} />
        </FloatLabel>


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

export default NuevoProducto;
