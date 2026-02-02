import { useState, useEffect } from 'react';
import { Divider, Modal, Input } from 'antd';
import { Button } from 'antd';
import { VARIANTES_ACTIONS, initialVariantesValues } from '../utils/constants';
import { VariantForm } from './Forms/VariantForm';
import { ButtonSecundary } from './buttons/ButtonSecundary';
import { ButtonAmount } from './buttons/ButtonAmount';
import { ModalVariantForm } from './modals/ModalVariantForm';

const Variantes = ({ variantes, handleChange } = { variantes: [], handleChange: () => { } }) => {


    const [isFormValid, setIsFormValid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialVariantesValues);
    const [editMode, setEditMode] = useState(false);

    const [amountReceived, setAmountReceived] = useState(0);
    const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);
    const handleAmountSave = () => {
        console.log("amountReceived", amountReceived);
        setIsAmountModalOpen(false);
        setAmountReceived(0);
    };
    const handleAmountOk = () => {
        setIsAmountModalOpen(false);
    };
    const handleAmountChange = (e) => {
        setAmountReceived(e.target.value);
    };


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
                                            <ButtonAmount amount={variante.cantidad.value} clickHandler={() => console.log("click")} />
                                        </div>
                                    </div>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="variantes-add-button" onClick={() => showModal(null)}>
                <ButtonSecundary
                    label="Agregar variante"
                    onClick={() => showModal(null)}
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





            <Modal
                open={isAmountModalOpen}
                onCancel={handleAmountOk}
                closable={false}
                title={
                    <div>
                        <div className="modal-title">
                            <div style={{ marginBottom: '20px' }}>
                                <Button type="primary" onClick={handleAmountOk}>
                                    Cerrar
                                </Button>
                            </div>
                            <div>
                                Existencias Recibidas
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <Button type="primary" onClick={handleAmountSave}>
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </div>
                }>
                <div>
                    <Input type="number" value={amountReceived} onChange={handleAmountChange} />
                </div>

            </Modal>
        </div>
    );
};

export default Variantes;