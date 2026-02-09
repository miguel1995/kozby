import { useFormProductoHandler } from '../hooks/useFormProductoHandler';
import { useNavigate } from 'react-router';
import { ProductForm } from '../components/Forms/ProductForm';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { formatDate } from '../utils/dateUtils';
import Variantes from '../components/Variantes';
import { ModalLoader } from '../components/modals/modalLoader';
import { ModalError } from '../components/modals/ModalError';
import { ButtonClose } from '../components/buttons/ButtonClose';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { Divider } from 'antd';
import { ButtonDanger } from '../components/buttons/ButtonDanger';
import { Modal, Space } from 'antd';
import { useMemo } from 'react';



const FormProducto = ({ isEditMode = false }) => {



  const {
    loading,
    values,
    fechaCreacion,
    fechaModificacion,
    isFormValid,
    isModalOpen,
    handleChange,
    handleSubmit,
    handleOk,
    showFormErrors,
    hacerClick,
    isDeleteModalOpen,
    handleCancelDelete,
    isArchived,
    handleDeletePermanent,
    handleArchive
  } = useFormProductoHandler(isEditMode);

  const navigate = useNavigate();

  const modalFotterActions = useMemo(() => {


    if (isArchived) {
      return [
        <ButtonSecundary
          key="cancel"
          onClick={handleCancelDelete}
          label="Cancelar"
        />,
        <ButtonDanger
          key="delete"
          onClick={handleDeletePermanent}
          label="Eliminar permanentemente"
        />
      ];
    } else {
      return [
        <ButtonSecundary
          key="cancel"
          onClick={handleCancelDelete}
          label="Cancelar"
        />,
        <ButtonSecundary
          key="archive"
          onClick={handleArchive}
          label="Archivar"
        />,
        <ButtonDanger
          key="delete"
          onClick={handleDeletePermanent}
          label="Eliminar permanentemente"
        />
      ];
    }
  }, [isArchived, handleCancelDelete, handleDeletePermanent, handleArchive]);


  return (
    <>
      <div style={{ position: 'relative' }}>

        <div>
          <div className="form-producto-actions">

            <ButtonClose
              onClick={() => navigate('/productos')}
            />
            <SubmitButton
              text="Guardar"
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>

          {isEditMode ? (
            <>
              <div className="form-producto-title">Editar artículo</div>
              <div className="form-producto-subtitle">
                <span>Artículo creado el {formatDate(fechaCreacion)}</span>
                <span>Última modificación el {formatDate(fechaModificacion)}</span>
              </div>
            </>
          ) : (
            <div className="form-producto-title">Crear artículo</div>
          )}
        </div>

        <div className="form-producto-container">

          {showFormErrors && isFormValid === false && (
            <div className="error-messages">
              <div className="error-messages-title">
                <div><ExclamationCircleOutlined /></div>
                <span>Corrige estos errores para guardar este artículo:</span>
              </div>
              <ul>
                {Object.entries(values).map(field => {
                  if (field[1].error) {
                    return <li key={field[0]}>{field[1].error}</li>;
                  }
                  return null;
                })}
              </ul>
            </div>
          )}

          <ProductForm values={values} handleChange={handleChange} />
          <Variantes variantes={values.variantes.value} handleChange={handleChange} />
          {isEditMode && (
            <>
              <Divider />

              <div className="form-producto-actions-container">
                <div>
                  <ButtonSecundary
                    label={isArchived ? "Restaurar artículo" : "Archivar artículo"}
                    onClick={() => hacerClick(isArchived ? "restore" : "archive", {})}
                  />
                </div>
                <div>
                  <ButtonDanger
                    label="Eliminar artículo"
                    onClick={() => hacerClick("delete", {})}
                  />
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <ModalError
        open={isModalOpen}
        onOk={handleOk}
      />

      <ModalLoader loading={loading} message={isEditMode ? "Guardando cambios..." : "Creando artículo..."} />

      <Modal
        title={
          <Space>
            <span style={{ color: '#000000', fontSize: 20, fontWeight: 'bold' }}>Eliminar Artículo</span>
          </Space>
        }
        className="modal-delete-product"
        closable={false}
        open={isDeleteModalOpen.open}
        onCancel={handleCancelDelete}
        footer={modalFotterActions}
        modalRender={modal => (
          <div style={{ borderRadius: 20, overflow: 'hidden' }}>
            {modal}
          </div>
        )}
      >


        <div style={{ marginBottom: '20px' }}>
          <p>
            ¿Está seguro que desea eliminar el artículo <strong>{isDeleteModalOpen.nombre}</strong>? Las transacciones asociadas a este artículo se perderán.
          </p>

        </div>

        <div style={{ marginBottom: '16px' }}>
          <p>
            Si desea archivar el producto, este se ocultará de la lista, pero no perderá ningún dato asociado; podrá restaurarlo en cualquier momento.
          </p>
        </div>

      </Modal>

    </>
  );
};

export default FormProducto;
