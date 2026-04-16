import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { postUsuario, putUsuario, getUsuarioById } from "../services/usuarios.service";
import { checkToken } from "../utils/authUtils";
import crypto from "crypto-js";


const buildInitialValues = (isEditMode) => ({
  username: { value: "", valid: false, required: true, error: "Ingrese usuario" },
  password: { value: "", valid: isEditMode ? true : false, required: !isEditMode, error: "Ingrese contraseña" },
  role: { value: "", valid: false, required: true, error: "Ingrese rol" },
});



export const useFormUsuarioHandler = (isEditMode = false) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(buildInitialValues(isEditMode));
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorData, setErrorData] = useState({ codeError: null, isOpen: false });

  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    setIsFormValid(
      Object.values(values).every((field) => {
        if (field.required) return field.valid === true;
        return true;
      })
    );
  }, [values]);

  useEffect(() => {
    if (id && isEditMode) {
      fetchUsuario(id);
    }
  }, [id, isEditMode]);

  const handleOk = () => {
    setErrorData({ codeError: null, isOpen: false });
  };

  const fetchUsuario = async (userId) => {
    try {
      checkToken();
      const data = await getUsuarioById(userId);

      setValues({
        username: { value: data.username || "", valid: true, required: true, error: "Ingrese usuario" },
        password: { value: "", valid: true, required: false, error: "Ingrese contraseña" },
        role: { value: data.role || "", valid: true, required: true, error: "Ingrese rol" },
      });
    } catch (err) {
      setErrorData({ codeError: err.status || 500, isOpen: true });
    }
  };

  const handleChange = (e) => {
    const name = e.target?.name;
    if (!name) return;

    let value = e.target.value;

    let isValid = true;
    let error = null;

    if (name === "username") {
      if (value.includes(" ")) return;

      const regex = /^[^\s]{1,20}$/;
      isValid = regex.test(value);
      error = isValid ? null : "Máx 20 caracteres y sin espacios";
    } else if (name === "password") {
      if (!value) {
        isValid = values.password.required ? false : true;
        error = isValid ? null : "Mín 5 y máx 20 caracteres";
      } else {
        const regex = /^.{5,20}$/;
        isValid = regex.test(value);
        error = isValid ? null : "Mín 5 y máx 20 caracteres";
      }
    } else {
      isValid = value !== "";
      error = isValid ? null : values[name].error;
    }

    setValues({
      ...values,
      [name]: {
        ...values[name],
        value,
        valid: isValid,
        error,
      },
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!isFormValid) return false;

    try {
      checkToken();

      const payload = {
        username: values.username.value,
        role: values.role.value,
      };

      if (values.password.value) {
        payload.password = crypto.MD5(values.password.value).toString();
      }

      if (isEditMode) {
        await putUsuario(id, payload);
      } else {
        payload.password = crypto.MD5(values.password.value).toString();
        await postUsuario(payload);
      }

      return true;
    } catch (err) {
      setErrorData({ codeError: err.status || 500, isOpen: true });
      return false;
    }
  };

  return {
    submitted,
    values,
    handleChange,
    handleSubmit,
    errorData,
    handleOk,
  };
};
