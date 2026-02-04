import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Button } from 'antd';
import { VARIANTES_ACTIONS, initialVariantesValues } from '../utils/constants';
import { VariantForm } from './Forms/VariantForm';

const Variantes = ({ variantes, handleChange } = { variantes: [], handleChange: () => { } }) => {


    const [isFormValid, setIsFormValid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialVariantesValues);
    const [editMode, setEditMode] = useState(false);



    useEffect(() => {
        console.log("Variantes values", values);
        setIsFormValid(Object.values(values).every(value => value.valid));
    }, [values]);

    const showModal = (variante) => {
        if (variante) {
            setValues(variante);
            setEditMode(true);
        }
        else {
            setValues(initialVariantesValues);
            setEditMode(false);
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
            // Generar ID único si no existe (para nuevas variantes)
        if (!editMode) {
            values.id.value = crypto.randomUUID();
        }

        handleChange(
            {
                target: {
                    name: "variantes",
                    action: editMode ? VARIANTES_ACTIONS.UPDATE : VARIANTES_ACTIONS.CREATE,
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

    const handleVariantDelete = (id) => {
        handleChange(
            {
                target: {
                    name: "variantes",
                    action: VARIANTES_ACTIONS.DELETE,
                    value: id
                }
            });
        handleVariantOk();
        resetValues();
    };

    return (
        <div className="variantes-container">

            <div className="variantes-title">Variantes</div>
            <div className="variantes-subtitle">Establece los precios y la disponibilidad por variantes, como tamaños o colores.</div>
            <div className="variantes-add-button" onClick={() => showModal(null)}>Agregar</div>
            {variantes.length > 0 && (
                <div className="variantes-list">
                    {variantes.map((variante) => (   
                        <div key={variante.id.value} className="variante-item" onClick={() => showModal(variante)}>
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
                                {editMode ? "Editar Variante" : "Agregar Variante"}
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
                {editMode && (
                    <div className="modal-delete-button" onClick={() => handleVariantDelete(values.id.value)}>
                        <Button type="primary" danger>
                            Eliminar
                        </Button>
                    </div>
                )}
               
            </Modal>
        </div>
    );
};

export default Variantes;