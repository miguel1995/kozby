import { Modal } from 'antd';
import { VariantForm } from '../Forms/VariantForm';
import { ButtonClose } from '../buttons/ButtonClose';
import { SubmitButton } from '../buttons/SubmitButton';
import { ButtonSecundary } from '../buttons/ButtonSecundary';
import { Divider } from 'antd';
export const ModalVariantForm = ({ 
    isModalOpen, 
    handleVariantOk, 
    handleVariantCreate, 
    isFormValid, 
    editMode,
    values,
    handleVariantChange,
    handleVariantDelete
}) => {

    return (
        <Modal
        className="modal-variant-form"
        open={isModalOpen}
        onCancel={handleVariantOk}
        footer={null}
        closable={false}
        title={

            <div>
                <div className="modal-title">
                    <div style={{ marginBottom: '20px' }}>
                        <ButtonClose onClick={handleVariantOk} />
                    </div>
                    <div>
                        {editMode ? "Modificar Variante" : "Agregar Variante"}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <SubmitButton text="Guardar" onClick={handleVariantCreate} disabled={!isFormValid} />
                    </div>
                </div>
            </div>

        }>


        <VariantForm values={values} handleVariantChange={handleVariantChange} />
        {editMode && (
            <>
            <Divider />
            <div className="modal-delete-button">
                <ButtonSecundary 
                label="Eliminar artículo" 
                onClick={() => handleVariantDelete(values.id.value)} 
                />
            </div>
            </>
        )}

    </Modal>

    );

}