import { useEffect, useState } from 'react';
import { checkToken } from '../utils/authUtils';
import { getTransaccionById } from '../services/transacciones.service';

export const useTransaccionDetalleHandler = (id, refreshKey = null) => {
  const [transaccion, setTransaccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState({ codeError: null, isOpen: false });

  const handleOk = () => setErrorData({ codeError: null, isOpen: false });

  useEffect(() => {
    const fetchTransaccion = async () => {
      setLoading(true);
      try {
        checkToken();
        const data = await getTransaccionById(id);
        setTransaccion(data);
      } catch (error) {
        setErrorData({ codeError: error.status || 500, isOpen: true });
        setTransaccion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaccion();
  }, [id, refreshKey]);

  return { transaccion, loading, errorData, handleOk };
};
