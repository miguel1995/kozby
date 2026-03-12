import { useState, useEffect } from 'react';
import { Divider, Modal, Input } from 'antd';
import { Button } from 'antd';
import { VARIANTES_ACTIONS, initialVariantesValues } from '../utils/constants';
import { VariantForm } from './Forms/VariantForm';
import { ButtonSecundary } from './buttons/ButtonSecundary';
import { ButtonAmount } from './buttons/ButtonAmount';
import { ModalVariantForm } from './modals/ModalVariantForm';
import { message } from 'antd';
import ModalAditionalAmount from './modals/ModalAditionalAmount';
const Variantes = ({ variantes, handleChange } = { variantes: [], handleChange: () => { } }) => {



    const [isFormValid, setIsFormValid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialVariantesValues);
    const [editMode, setEditMode] = useState(false);

    const [amountReceived, setAmountReceived] = useState(0);
    const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);


    useEffect(() => {
        setIsFormValid(Object.values(values).every(value => value.valid));
    }, [values]);

    const handleAmountSave = () => {
        let valuesToSend = values;
        valuesToSend.cantidad.value = amountReceived;
        handleChange(
            {
                target: {
                    name: "variantes",
                    action: VARIANTES_ACTIONS.UPDATE,
                    value: valuesToSend,
                }
            });
        setIsAmountModalOpen(false);
        setAmountReceived(0);
    };

    const handleAmountOk = () => {
        setIsAmountModalOpen(false);
    };

    const handleAmountChange = (e) => {
        setAmountReceived(e.target.value);
    };

    const showAmountModal = (variante) => {
        setIsAmountModalOpen(true);
        setValues(variante);
    };


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
        let valuesToSend = values;

        if (!editMode) {
            const newId = crypto.randomUUID();
            valuesToSend = {
                ...values,
                id: {
                    value: newId,
                    valid: true
                }
            };
        }

        handleChange(
            {
                target: {
                    name: "variantes",
                    action: editMode ? VARIANTES_ACTIONS.UPDATE : VARIANTES_ACTIONS.CREATE,
                    value: valuesToSend,
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

            {variantes.length > 0 && (
                <>
                    <div className="variantes-title">Variantes</div>

                    <div className="variantes-list">
                        {variantes.map((variante) => (
                            <div key={variante.id.value}>
                                <div className="variante-item" onClick={() => showModal(variante)}>
                                    <div className="variante-item-info-container" >
                                        <div className="variante-item-nombre">{variante.nombre.value}</div>
                                        <div className="variante-item-precio">$ {variante.precio.value}</div>
                                    </div>
                                    <div>
                                        <div className="variante-item-cantidad">
                                            <ButtonAmount amount={variante.cantidad.value} clickHandler={() => {showAmountModal(variante)}} />
                                        </div>
                                    </div>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="variantes-add-button">
                <ButtonSecundary
                    label="Agregar variante"
                    onClick={() => {
                        if (variantes.length < 10) {
                            showModal(null)
                        }
                        else {
                            message.error("No se puede agregar más de 10 variantes");
                        }
                    }}
                />
            </div>



            <ModalVariantForm
                isModalOpen={isModalOpen}
                handleVariantOk={handleVariantOk}
                handleVariantCreate={handleVariantCreate}
                isFormValid={isFormValid}
                editMode={editMode}
                values={values}
                handleVariantChange={handleVariantChange}
                handleVariantDelete={handleVariantDelete}
            />





            <ModalAditionalAmount
                isModalOpen={isAmountModalOpen}
                onCancel={handleAmountOk}
                handleSave={handleAmountSave}
                handleChange={handleAmountChange}
                currentAmount={values.cantidad.value}
            />
        </div>
    );
};

export default Variantes;