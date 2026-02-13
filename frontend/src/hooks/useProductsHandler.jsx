import React, { useState, useEffect } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';

import {
  getProductos,
  getProductosArchivados
} from '../services/productos.service';
import { useNavigate } from 'react-router';

export const useProductsHandler = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verArchivados, setVerArchivados] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const navigate = useNavigate();


  useEffect(() => {
    if (verArchivados !== null) {
      fetchProductos();
    }
  }, [verArchivados]);


  useEffect(() => {
    if (error) {
      showModal();
    }
  }, [error]);
  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
      setIsModalOpen(false);
  };

  const hacerClick = async (key, record) => {

    const { id } = record;

    if (key === 'edit') {
      navigate(`/editar-producto/${id}`);
      return;
    }

  };






  const fetchProductos = async () => {
    setLoading(true);
    try {
      const data = verArchivados
        ? await getProductosArchivados()
        : await getProductos();

      setProductos(data);
    } catch (err) {
      setError(err.message);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };





  return {
    loading,
    error,
    verArchivados,
    setVerArchivados,
    isModalOpen,
    handleOk,
    productos,
    hacerClick
  };
};
