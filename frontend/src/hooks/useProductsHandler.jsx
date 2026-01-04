import React, { useState, useEffect } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import { getProductos } from '../services/productos.service';

export const useProductsHandler = () => {
    const [tableData, setTableData] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectionType, setSelectionType] = useState('checkbox');


    const items = [
        { label: 'Editar', key: 'edit' },
        { label: 'Eliminar', key: 'delete' },
        { label: 'Ver más', key: 'more' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (error) {
            showModal()
        }
    }, [error])

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    function hacerClick({ key }) {
        if (key === 'edit') {
            message.success('Editar producto');
            return;
        }
        if (key === 'delete') {
            message.warning('Eliminar producto');
            return;
        }
        if (key === 'more') {
            message.info('Ver más');
            return;
        }
    }

    const menuProps = {
        items,
        onClick: hacerClick,
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
                <Dropdown menu={menuProps} trigger={["click"]}>
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
        handleOk,
        isModalOpen,
    };
};
