import { useFormUsuarioHandler } from "../hooks/useFormUsuarioHandler";
import { UsuarioForm } from "../components/Forms/UsuarioForm";
import { SubmitButton } from "../components/buttons/SubmitButton";
import { ButtonClose } from "../components/buttons/ButtonClose";
import { useNavigate } from "react-router";
import { ModalError } from "../components/modals/ModalError";

const FormUsuario = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { values, handleChange, handleSubmit, errorData, handleOk, submitted  } = useFormUsuarioHandler(isEditMode);

  const onSave = async () => {
    const ok = await handleSubmit();
    if (ok) navigate("/usuarios");
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="form-producto-actions">
        <ButtonClose onClick={() => navigate(-1)} />
        <SubmitButton text="Guardar" onClick={onSave} />
      </div>

      <div className="form-producto-title">
        {isEditMode ? "Editar usuario" : "Crear usuario"}
      </div>

      <div className="form-producto-container">
        <UsuarioForm values={values} handleChange={handleChange} submitted={submitted} />
      </div>


      <ModalError open={errorData.isOpen} errorCode={errorData.codeError} onOk={handleOk} />
    </div>
  );
};

export default FormUsuario;
