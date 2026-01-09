import React, { useState, useEffect } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import {
  getProductos,
  getProductosArchivados,
  archiveProducto,
  restaurarProducto,
  deleteProducto,
} from '../services/productos.service';

export const useProductsHandler = () => {
  const [tableData, setTableData] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [verArchivados, setVerArchivados] = useState(false);

  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

 
  const items = selectedProduct?.archivado
    ? [
        { label: 'Restaurar', key: 'restore' },
        { label: 'Eliminar', key: 'delete' },
      ]
    : [
        { label: 'Editar', key: 'edit' },
        { label: 'Archivar', key: 'archive' },
      ];

 
  const hacerClick = async ({ key }, record) => {
    setSelectedProduct(record);

    if (key === 'edit') {
      message.info('Editar producto');
      return;
    }

    if (key === 'archive') {
      await archiveProducto(record.id);
      message.success('Producto archivado');
      fetchProductos();
      return;
    }

    if (key === 'restore') {
      await restaurarProducto(record.id);
      message.success('Producto restaurado');
      fetchProductos();
      return;
    }

    if (key === 'delete') {
      setIsDeleteModalOpen(true);
      return;
    }
  };

  
  const handleDeletePermanent = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      await deleteProducto(selectedProduct.id);
      message.success('Producto eliminado definitivamente');
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      fetchProductos();
    } catch (err) {
      message.error('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

 
  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (src) => (
        <img src={src} alt="" style={{ width: 40, objectFit: 'cover' }} />
      ),
    },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio' },
    {
      title: 'Estado',
      dataIndex: 'archivado',
      key: 'archivado',
      render: (v) => (v ? 'Archivado' : 'Activo'),
    },
    {
      title: '',
      key: 'acciones',
      render: (_, record) => (
        <Dropdown
          menu={{ items, onClick: (e) => hacerClick(e, record) }}
          trigger={['click']}
        >
          <EllipsisOutlined style={{ fontSize: 22 }} />
        </Dropdown>
      ),
    },
  ];

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

  useEffect(() => {
    fetchProductos();
  }, [verArchivados]);

  useEffect(() => {
    setTableData(productos.map((p) => ({ key: p.id, ...p })));
  }, [productos]);

 
  return {
    columns,
    tableData,
    loading,
    error,
    verArchivados,
    setVerArchivados,
    isDeleteModalOpen,
    handleDeletePermanent,
    handleCancelDelete,
  };
};
