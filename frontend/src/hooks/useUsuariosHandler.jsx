import { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario } from "../services/usuarios.service";
import { checkToken } from "../utils/authUtils";

export const useUsuariosHandler = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [errorData, setErrorData] = useState({ codeError: null, isOpen: false });

  const handleOk = () => {
    setErrorData({ codeError: null, isOpen: false });
  };

  const cargar = async () => {
    try {
      checkToken();
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setErrorData({ codeError: err.status || 500, isOpen: true });
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminarUsuario = async (id) => {
    try {
      checkToken();
      await deleteUsuario(id);
      await cargar();
    } catch (err) {
      setErrorData({ codeError: err.status || 500, isOpen: true });
    }
  };

  return {
    usuarios,
    cargar,
    eliminarUsuario,
    errorData,
    handleOk,
  };
};
