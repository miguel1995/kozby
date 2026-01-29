import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Button } from 'antd';
import { VARIANTES_ACTIONS, initialVariantesValues } from '../utils/constants';
import { VariantForm } from './Forms/VariantForm';

const Variantes = ({ variantes, handleChange } = { variantes: [], handleChange: () => { } }) => {


    const [isFormValid, setIsFormValid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialVariantesValues);



    useEffect(() => {
        console.log("Variantes values", values);
        setIsFormValid(Object.values(values).every(value => value.valid));
    }, [values]);

    const showModal = (variante) => {
        if (variante) {
            setValues(variante);
        }
        else {
            setValues(initialVariantesValues);
        }
        setIsModalOpen(true);
    };
    const handleVariantOk = () => {
        setIsModalOpen(false);
    };

    const handleVariantChange = (e) => {
        if (e.target?.name) {
            setValues({
                ...values,
                [e.target.name]: {
                    ...values[e.target.name],
                    value: e.target.value,
                    valid: e.target.value != ""
                }
            });
        }

    };

    const handleVariantCreate = () => {
        handleChange(

            {
                target: {
                    name: "variantes",
                    action: VARIANTES_ACTIONS.CREATE,
                    value: values,
                    valid: isFormValid
                }
            });
        handleVariantOk();
        resetValues();
    };


const resetValues = () => {
    setValues(initialVariantesValues);
    setIsFormValid(false);
    setIsModalOpen(false);
}

    return (
        <div className="variantes-container">

            <div className="variantes-title">Variantes</div>
            <div className="variantes-subtitle">Establece los precios y la disponibilidad por variantes, como tamaños o colores.</div>
            <div className="variantes-add-button" onClick={() => showModal(null)}>Agregar</div>
            {variantes.length > 0 && (
                <div className="variantes-list">
                    {variantes.map((variante, index) => (   
                        <div key={index} className="variante-item" onClick={() => showModal(variante)}>
                            <div className="variante-item-nombre">{variante.nombre.value}</div>
                            <div className="variante-item-precio">$ {variante.precio.value}</div>
                            <div className="variante-item-cantidad">{variante.cantidad.value}</div>
                            <div className="variante-item-admin"> Administrar existencias</div>
                        </div>
                    ))}
                </div>
            )}

            <Modal 
            open={isModalOpen} 
            onCancel={handleVariantOk}
            footer={null}
            closable={false}
                title={

                    <div>
                        <div className="modal-title">
                            <div style={{ marginBottom: '20px' }}>
                                <Button type="primary" onClick={handleVariantOk}>
                                    Cerrar
                                </Button>
                            </div>
                            <div>
                                Agregar Variante
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <Button type="primary" onClick={handleVariantCreate} disabled={!isFormValid} block>
                                    Listo
                                </Button>
                            </div>
                        </div>
                    </div>

                }>


                <VariantForm values={values} handleVariantChange={handleVariantChange} />

               
            </Modal>
        </div>
    );
};

export default Variantes;