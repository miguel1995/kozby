import { Modal } from 'antd';
import { DescuentoForm } from '../Forms/DescuentoForm';
import { ButtonClose } from '../buttons/ButtonClose';
import { SubmitButton } from '../buttons/SubmitButton';
import { ButtonSecundary } from '../buttons/ButtonSecundary';
import { Divider } from 'antd';
export const ModalDescuentoForm = ({ 
    isModalOpen, 
    handleDescuentoOk, 
    handleDescuentoCreate, 
    isFormValid, 
    editMode,
    values,
    handleDescuentoChange,
    handleDescuentoDelete
}) => {

    return (
        <Modal
        className="modal-variant-form"
        open={isModalOpen}
        onCancel={handleDescuentoOk}
        footer={null}
        closable={false}
        title={

            <div>
                <div className="modal-title">
                    <div style={{ marginBottom: '20px' }}>
                        <ButtonClose onClick={handleDescuentoOk} />
                    </div>
                    <div>
                        {editMode ? "Editarar Descuento" : "Crear Descuento"}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <SubmitButton text="Guardar" onClick={handleDescuentoCreate} disabled={!isFormValid} />
                    </div>
                </div>
            </div>

        }>


        <DescuentoForm values={values} handleDescuentoChange={handleDescuentoChange} />
        {editMode && (
            <>
            <Divider />
            <div className="modal-delete-button">
                <ButtonSecundary 
                label="Eliminar descuento" 
                onClick={() => handleDescuentoDelete(values.id.value)} 
                />
            </div>
            </>
        )}

    </Modal>

    );

}