import { useState } from "react";
import { useNavigate } from "react-router";
import { Modal, Space } from "antd";
import { ButtonSecundary } from "../components/buttons/ButtonSecundary";
import { ButtonDanger } from "../components/buttons/ButtonDanger";
import { useUsuariosHandler } from "../hooks/useUsuariosHandler";
import { ModalError } from "../components/modals/ModalError";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SubmitButton } from "../components/buttons/SubmitButton";

export default function Usuarios() {
  const navigate = useNavigate();
  const { usuarios, eliminarUsuario, errorData, handleOk } = useUsuariosHandler();

  const usuariosFiltrados = usuarios.filter((u) => u.role !== "Master");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    open: false,
    nombre: "",
    id: null,
  });

  const onDelete = (usuario) => {
    setIsDeleteModalOpen({
      open: true,
      nombre: usuario.username,
      id: usuario.id,
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen({ open: false, nombre: "", id: null });
  };

  const handleDeleteConfirm = async () => {
    await eliminarUsuario(isDeleteModalOpen.id);
    handleCancelDelete();
  };

  return (
    <div className="page-container">
      <div className="users-page">
        <div className="users-page-header">
          <div className="users-page-title">Usuarios</div>
          <SubmitButton
            text="Crear usuario"
            onClick={() => navigate("/nuevo-usuario")}
          />
        </div>
        <div className="users-table">
          {usuariosFiltrados.map((u) => (
            <div key={u.id} className="user-item">

              <div className="user-info">
                <div className="user-item-name">{u.username}</div>
                <div className="user-item-role">{u.role}</div>
              </div>

              <div className="user-item-actions">
                <button className="user-edit" onClick={() => navigate(`/editar-usuario/${u.id}`)}>
                  <EditOutlined />
                </button>
                <button className="user-delete" onClick={() => onDelete(u)}>
                  <DeleteOutlined />
                </button>
              </div>

            </div>
          ))}
        </div>

        <Modal
          title={
            <Space>
              <span style={{ color: "#000000", fontSize: 20, fontWeight: "bold" }}>
                Eliminar usuario
              </span>
            </Space>
          }
          className="modal-delete-user"
          closable={false}
          open={isDeleteModalOpen.open}
          onCancel={handleCancelDelete}
          footer={[
            <ButtonSecundary key="cancel" onClick={handleCancelDelete} label="Cancelar" />,
            <ButtonDanger key="delete" onClick={handleDeleteConfirm} label="Eliminar" />,
          ]}
          modalRender={(modal) => (
            <div style={{ borderRadius: 20, overflow: "hidden" }}>{modal}</div>
          )}
        >
          <div style={{ marginBottom: "20px" }}>
            <p>
              ¿Está seguro que desea eliminar al usuario{" "}
              <strong>{isDeleteModalOpen.nombre}</strong>?
            </p>
          </div>
        </Modal>

        <ModalError open={errorData.isOpen} errorCode={errorData.codeError} onOk={handleOk} />
      </div>
    </div>
  );
}
