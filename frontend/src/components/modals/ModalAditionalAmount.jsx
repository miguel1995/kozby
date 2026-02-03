import { Modal } from 'antd';
import { Input } from 'antd';
import { ButtonClose } from '../buttons/ButtonClose';
import { SubmitButton } from '../buttons/SubmitButton';
import { useState } from 'react';
import { useEffect } from 'react';
import { Divider } from 'antd';

const ModalAditionalAmount = ({ isModalOpen, onCancel, handleSave, handleChange, currentAmount }) => {
    const [amount, setAmount] = useState(0);
    const onChange = (e) => {
        const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
        setAmount(digitsOnly.slice(0, 2));
    }
    useEffect(() => {
        setAmount(0);
    }, [isModalOpen]);

    useEffect(() => {
        console.log(amount);
        handleChange({
            target: {
                name: "cantidad",
                value: Number(currentAmount) + Number(amount),
            }
        });
    }, [amount]);
    return (
        <Modal
            className="modal-add-amount"
            open={isModalOpen}
            onCancel={onCancel}
            closable={false}
            footer={null}
            title={

                <div className="modal-title">
                    <div style={{ marginBottom: '20px' }}>
                        <ButtonClose onClick={onCancel} />
                    </div>
                    <div>
                        Existencias Recibidas
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <SubmitButton text="Guardar" onClick={() => handleSave(amount)} disabled={!amount} />
                    </div>
                </div>

            }>
            <div className="modal-content-row">
                <div>Existencia Actual</div>
                <div>{Number(currentAmount)}</div>
            </div>
            <Divider />
            <div className="modal-content-row">
                <div>Recibido</div>
                <div><Input type="number" value={amount} maxLength={2} onChange={onChange} /></div>
            </div>
            <Divider />
            <div className="modal-content-row">
                <div>Nuevo Total</div>
                <div>{Number(currentAmount) + Number(amount)}</div>
            </div>
        </Modal>
    );
};

export default ModalAditionalAmount;