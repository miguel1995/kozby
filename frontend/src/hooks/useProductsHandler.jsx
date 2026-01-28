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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verArchivados, setVerArchivados] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    open: false,
    nombre: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const items = verArchivados
    ? [
      { label: 'Restaurar', key: 'restore' },
      { label: 'Eliminar', key: 'delete' },
    ]
    : [
      { label: 'Editar', key: 'edit' },
      { label: 'Archivar', key: 'archive' },
      { label: 'Eliminar', key: 'delete' }
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
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (text) => {
        const available = text > 0;
        text = available ? "Disponible (" + (text) + ")" : 'Agotado (' + (text) + ")";;

        return <div className={available ? 'productos-page-cantidad-disponible' : 'productos-page-cantidad-no-disponible'}>{text}</div>;    

      },
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
    if (verArchivados !== null) {
      fetchProductos();
    }
  }, [verArchivados]);

  useEffect(() => {
    setTableData(productos.map((p) => ({ key: p.id, ...p })));
  }, [productos]);

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

  const hacerClick = async (event, record) => {
     setSelectedProduct(record);

    const { key } = event;
    const { id } = record;

    if (key === 'edit') {
      navigate(`/editar-producto/${id}`);
      return;
    }

    if (key === 'archive') {
      setLoading(true);
      try {
        await archiveProducto(id);
        message.success('Producto archivado');
        fetchProductos();
        return;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      message.success('Producto archivado');
      fetchProductos();
      return;
    }

    if (key === 'restore') {
      setLoading(true);
      try {
        await restaurarProducto(id);
        message.success('Producto restaurado');
        fetchProductos();
        return;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (key === 'delete') {
      setIsDeleteModalOpen({
        open: true,
        nombre: record.nombre,
      });
      return;
    }
  };


  const handleDeletePermanent = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const fullFileName = selectedProduct.imagen.split('/').pop(); // "o8vyvxdh2zhwsl8gmlyo.png"
      const imageId = "kozby/products/" + fullFileName.split('.')[0];     // "o8vyvxdh2zhwsl8gmlyo"
      await deleteProducto(selectedProduct.id,imageId);
      message.success('Producto eliminado definitivamente');
      setIsDeleteModalOpen({
        open: false,
        nombre: '',
      });
      setSelectedProduct(null);
      fetchProductos();
    } catch (err) {
      message.error('Error al eliminar');
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
        setIsDeleteModalOpen({
          open: false,
          nombre: '',
        });
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

  const handleArchive = async () => {
    if (!selectedProduct) return;
    await archiveProducto(selectedProduct.id);
    message.success('Producto archivado');
    fetchProductos();
    setIsDeleteModalOpen({
      open: false,
      nombre: '',
    });
    setSelectedProduct(null);

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
    handleRowClick,
    isModalOpen,
    handleOk,
    handleArchive
  };
};
