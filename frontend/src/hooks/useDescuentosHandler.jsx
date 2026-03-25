import { useState, useEffect } from 'react';
import { checkToken } from '../utils/authUtils';
import { getDescuentos } from '../services/descuentos.service';

export const useDescuentosHandler = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState({
    codeError: null,
    isOpen: false,
  });

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
  };
};
