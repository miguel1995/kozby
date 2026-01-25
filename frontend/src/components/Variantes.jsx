import { useState } from 'react';
import { Modal } from 'antd';

const Variantes = ({ variantes, handleChange } = { variantes: [], handleChange: () => {} }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const [values, setValues] = useState({ 
        
        nombre: {
            value: "",
            valid: null,
            required: true,
            error: "Ingrese un nombre del artículo"
      },
      precio: {
        value: "",
        valid: null,
        required: true,
        error: "Ingrese un precio valido"
      },
      cantidad: {
        value: "0",
        valid: true,
        required: true,
        error: "Ingrese una cantidad valida"
      }
    });


    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: {
                ...values[e.target.name],
                value: e.target.value
            }
        });
    };
    const handleCreate = () => {
        console.log(values);
    };
    return (
        <div className="variantes-container">
            
            <div className="variantes-title">Variantes</div>
            <div className="variantes-subtitle">Establece los precios y la disponibilidad por variantes, como tamaños o colores.</div>
            <div className="variantes-add-button" onClick={showModal}>Agregar</div>
            {variantes.map((variante, index) => (
                <div key={index} className="variante-item" onClick={() => setIsModalOpen(true)}>
                    <div className="variante-item-name">{variante.nombre}</div>
                    <div className="variante-item-price">{variante.precio}</div>
                    <div className="variante-item-cantidad">{variante.cantidad}</div>
                </div>
            ))}
            <Modal open={isModalOpen} onCancel={handleOk} title="Agregar Variante">
                nombre
                precio
                cantidad
                <Button onClick={handleCreate}>Crear Variante</Button>
            </Modal>
        </div>
    );
};

export default Variantes;