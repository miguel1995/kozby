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
import { useNavigate } from 'react-router';

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


  const columns = [
    {
      title: '',
      dataIndex: 'imagen',
      key: 'imagen',
      width: 42,
      render: (src) => (
        <img src={src} alt="" style={{ width: 39, height: 'auto', objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Artículo',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text) => text,
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria_nombre',
      key: 'categoria_nombre',
      render: (text) => "En construcción",
    },
    {
      title: 'Disponibilidad',
      dataIndex: 'disponibilidad_producto',
      key: 'disponibilidad_producto',
      render: (text) => text,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (p) => `$${p}`,
    },
    {
      title: '',
      key: 'acciones',
      render: (_, record) => (
        <Dropdown menu={{ items, onClick: (event) => hacerClick(event, record) }} trigger={["click"]}>
          <EllipsisOutlined
            style={{ fontSize: '25px' }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const navigate = useNavigate();


  useEffect(() => {
    fetchProductos();
  }, [verArchivados]);

  useEffect(() => {
    setTableData(productos.map((p) => ({ key: p.id, ...p })));
  }, [productos]);

  const hacerClick = async (event, record) => {
    setSelectedProduct(record);

    const { key } = event;
    const { id } = record;

    if (key === 'edit') {
      navigate(`/editar-producto/${id}`);
      return;
    }

    if (key === 'archive') {
      await archiveProducto(id);
      message.success('Producto archivado');
      fetchProductos();
      return;
    }

    if (key === 'restore') {
      await restaurarProducto(id);
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

  const handleRowClick = (record) => {
    return {
      onClick: () => {
        navigate(`/editar-producto/${record.id}`);
      },
      style: { cursor: 'pointer' }
    };
  };


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
    handleRowClick
  };
};
