import React, { useState, useEffect } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import { getProductos, archiveProducto, deleteProducto } from '../services/productos.service';

export const useProductsHandler = () => {
    const [tableData, setTableData] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectionType, setSelectionType] = useState('checkbox');

    const items = [
        { label: 'Editar', key: 'edit' },
        { label: 'Eliminar', key: 'delete' },
    ];

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    function hacerClick({ key }, record) {
        if (key === 'edit') {
            message.success('Editar producto');
            return;
        }
        if (key === 'delete') {
            setSelectedProduct(record);
            setIsDeleteModalOpen(true);
            return;
        }
    }

    const handleArchive = async () => {
        if (!selectedProduct) return;
        
        setLoading(true);
        try {
            await archiveProducto(selectedProduct.id);
            message.success('Producto archivado correctamente');
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
            fetchProductos(); 
        } catch (err) {
            console.error('Error al archivar producto:', err);
            message.error('Error al archivar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePermanent = async () => {
        if (!selectedProduct) return;
        
        setLoading(true);
        try {
            await deleteProducto(selectedProduct.id);
            message.success('Producto eliminado permanentemente');
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
            fetchProductos(); // Recargar la lista
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            message.error('Error al eliminar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const menuProps = {
        items,
        onClick: (e) => hacerClick(e, null), // Necesitamos pasar el record
    };

    const columns = [
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            key: 'imagen',
            render: (src) => (
                <img src={src} alt="" style={{ width: 39, height: 'auto', objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => text,
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria_nombre',
            key: 'categoria_nombre',
            render: (text) => text,
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
            render: (p) => `$${p}`,
        },
        {
            title: 'Disponibilidad',
            dataIndex: 'disponibilidad_producto',
            key: 'disponibilidad_producto',
            render: (text) => text,
        },
        {
            title: '',
            key: 'acciones',
            render: (_, record) => (
                <Dropdown menu={{ ...menuProps, onClick: (e) => hacerClick(e, record) }} trigger={["click"]}>
                    <EllipsisOutlined style={{ fontSize: '25px' }} />
                </Dropdown>
            ),
        },
    ];

    useEffect(() => {
        fetchProductos();
    }, []);

    useEffect(() => {
        const productosMap = productos.map((p) => ({ key: p.id, ...p }));
        setTableData(productosMap);
    },[productos])

   const fetchProductos = async () => {
    setLoading(true);
    try {
        const data = await getProductos();
        setProductos(data);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        setError(err.message || 'Error');
        setProductos([]);
    } finally {
        setLoading(false);
    }
};

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.nombre === 'Disabled User',
            name: record.nombre,
        }),
    };

    return {
        columns,
        tableData,
        rowSelection,
        selectionType,
        setSelectionType,
        loading,
        error,
        showModal,
        handleOk,
        isModalOpen,
        // Nuevos estados y funciones para el modal de eliminación
        isDeleteModalOpen,
        selectedProduct,
        handleArchive,
        handleDeletePermanent,
        handleCancelDelete,

    };
};