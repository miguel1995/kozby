import { useState, useEffect } from 'react';
import { checkToken } from '../utils/authUtils';
import { getDescuentos, postDescuento, putDescuento } from '../services/descuentos.service';
import { initialDescuentosValues } from '../utils/constants';

export const useDescuentosHandler = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState({
    codeError: null,
    isOpen: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [values, setValues] = useState(initialDescuentosValues);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    console.log(values);
    setIsFormValid(Object.values(values).every(field => {
      return field.valid === true;
    }));
  }, [values]);

  useEffect(() => {
    console.log(isFormValid);
    setValues((prev) => ({
      ...prev,
      monto: {
        ...prev.monto,
        value: "",
        valid: false
      },
    }));

  }, [values.tipo]);

  const handleDescuentoOk = () => {
    setIsModalOpen(false);
  };

  const handleDescuentoChange = (e) => {
    const { name, value } = e?.target ?? {};
    if (name == null || name === '') return;

    const nextValue = value ?? '';

    setValues((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: nextValue,
        valid: nextValue !== '',
      },
    }));
  };


  const createNewDescuento = async (descuentoData) => {
    setLoading(true);
    try {
        checkToken();
        const data = await postDescuento(descuentoData);
        resetValues();
        fetchDescuentos();
    } catch (err) {
        setErrorData({
            codeError: err.status || 500,
            isOpen: true
        });
    } finally {
        setLoading(false);
    }
};

const updateDescuento = async (id, descuentoData) => {
    setLoading(true);
    try {
        checkToken();
        const data = await putDescuento(id, descuentoData);
        resetValues();
        fetchDescuentos();
    } catch (err) {
        setErrorData({
            codeError: err.status || 500,
            isOpen: true
        })
    } finally {
        setLoading(false);
    }
};


const handleDescuentoSubmit = () => {

      if (editMode) {
          updateDescuento(values.id.value, {
                nombre: values.nombre.value,
                tipo: values.tipo.value,
                monto: values.monto.value,
          });
      } else {
          createNewDescuento({
              nombre: values.nombre.value,
              tipo: values.tipo.value,
              monto: values.monto.value,
          });
      }
  
}

  const resetValues = () => {
    setValues(initialDescuentosValues);
    setIsFormValid(false);
    setIsModalOpen(false);
  }

  const handleDescuentoDelete = (id) => {
    handleChange(
      {
        target: {
          name: "descuentos",
          action: DESCUENTOS_ACTIONS.DELETE,
          value: id
        }
      });
    handleDescuentoOk();
    resetValues();
  };


  const handleOk = () => {
    setErrorData({
      codeError: null,
      isOpen: false,
    });
  };

  const fetchDescuentos = async () => {
    setLoading(true);
    try {
      checkToken();
      const data = await getDescuentos();
      setDescuentos(data);
    } catch (err) {
      setErrorData({
        codeError: err.status || 500,
        isOpen: true,
      });
      setDescuentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDescuentos();
  }, []);

  return {
    descuentos,
    loading,
    errorData,
    handleOk,
    isModalOpen,
    setIsModalOpen,
    editMode,
    setEditMode,
    values,
    setValues,
    isFormValid,
    setIsFormValid,
    handleDescuentoChange,
    handleDescuentoSubmit,
    resetValues,
    handleDescuentoDelete,
    handleDescuentoOk,
  };
};
