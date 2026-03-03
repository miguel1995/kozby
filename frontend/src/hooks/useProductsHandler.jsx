import React, { useState, useEffect } from 'react';
import { checkToken } from '../utils/authUtils';

import {
  getProductos,
  getProductosArchivados
} from '../services/productos.service';
import { useNavigate } from 'react-router';

export const useProductsHandler = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verArchivados, setVerArchivados] = useState(null);
  const [errorData, setErrorData] = useState({
    codeError: null,
    isOpen: false
  });


  const navigate = useNavigate();


  useEffect(() => {
    if (verArchivados !== null) {
      fetchProductos();
    }
  }, [verArchivados]);



  
 
  const handleOk = () => {
    setErrorData({
      codeError: null,
      isOpen: false
    });
  };

  const hacerClick = async (key, record) => {

    const { id } = record;

    if (key === 'edit') {
      navigate(`/editar-producto/${id}`);
      return;
    }

    if (key === 'nueva-orden') {
      navigate('/nueva-orden');
      return;
    }

  };






  const fetchProductos = async () => {
    setLoading(true);
    try {
      checkToken();
      const data = verArchivados
        ? await getProductosArchivados()
        : await getProductos();

      setProductos(data);
    } catch (err) {
      setErrorData({
        codeError: err.status || 500,
        isOpen: true
      });
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };





  return {
    loading,
    verArchivados,
    setVerArchivados,
    errorData,
    handleOk,
    productos,
    hacerClick
  };
};
