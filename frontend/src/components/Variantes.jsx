import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import FloatLabel from './FloatLabel';
import { Input } from 'antd';
import { NumericInput } from './NumericInput';
import { Button } from 'antd';
import { VARIANTES_ACTIONS, initialVariantesValues } from '../utils/constants';


const Variantes = ({ variantes, handleChange } = { variantes: [], handleChange: () => { } }) => {


    const [isFormValid, setIsFormValid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialVariantesValues);



    useEffect(() => {
        setIsFormValid(Object.values(values).every(value => value.valid));
    }, [values]);

    const showModal = () => {
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
            <div className="variantes-add-button" onClick={showModal}>Agregar</div>

            <Modal open={isModalOpen} onCancel={handleVariantOk}
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

                }


                footer={null}
                closable={false}>

                <div className="example">



                    <FloatLabel label="Nombre (requerido)" name="nombre" value={values.nombre.value}>
                        <Input
                            value={values.nombre.value}
                            name="nombre"
                            maxLength={45}
                            onChange={(e) => handleVariantChange(e)} />

                    </FloatLabel>
                    <FloatLabel label="Precio" name="precio" value={values.precio.value}>

                        <NumericInput
                            value={values.precio.value}
                            onChange={e => handleVariantChange(e)}
                            name="precio"
                            maxLength={10}
                        />


                    </FloatLabel>

                    <FloatLabel label="Cantidad" name="cantidad" value={values.cantidad.value}>

                        <NumericInput
                            value={values.cantidad?.value}
                            onChange={e => handleVariantChange(e)}
                            name="cantidad"
                            maxLength={3}
                        />
                    </FloatLabel>

                </div>
            </Modal>
        </div>
    );
};

export default Variantes;