import React, { useState, useEffect } from 'react';
import { checkToken } from '../utils/authUtils';

import {
  getProductos,
  getProductosArchivados
} from '../services/productos.service';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import { useOrder } from '../context/OrderContext';


export const useProductsHandler = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verArchivados, setVerArchivados] = useState(null);
  const [errorData, setErrorData] = useState({
    codeError: null,
    isOpen: false
  });


  const navigate = useNavigate();
  const { addProduct } = useOrder();


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

    const { id, cantidad, variantes, nombre, precio } = record;

    if (key === 'edit') {
      navigate(`/editar-producto/${id}`);
      return;
    }

    if (key === 'nueva-orden') {

      if (variantes.length > 0) {
        navigate(`/nueva-orden/${id}`);
        return;
      } else {
        if (cantidad > 0) {
          addProduct({
            productId: id,
            productName: nombre,
            variantId: "",
            variantName: "",
            precio: precio,
            cantidad: 1,
            notes: '',
            discounts: ''
          });
          message.info('Artículo agregado');
          return;
        } else {
          message.info('Artículo Agotado');
          return;
        }
      }


     
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
