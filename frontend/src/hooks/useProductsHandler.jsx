import React, { useState, useEffect } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import { getProductos } from '../services/productos.service';
import { useNavigate } from 'react-router';

export const useProductsHandler = () => {
    const [tableData, setTableData] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectionType, setSelectionType] = useState('checkbox');

    const navigate = useNavigate();


    const items = [
        { label: 'Editar', key: 'edit' },
        { label: 'Eliminar', key: 'delete' }
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

    function hacerClick(event, record) {
        console.log('eventClick', event);
        console.log('record', record);
        const { key } = event;
        const { id } = record;
        if (key === 'edit') {            
            navigate(`/editar-producto/${id}`);
            return;
        }
        if (key === 'delete') {
            message.warning('Eliminar producto');
            return;
        }

    }


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
                <Dropdown menu={{ items, onClick: (event) => hacerClick(event, record) }} trigger={["click"]}>
                    <EllipsisOutlined 
                        style={{ fontSize: '25px' }} 
                        onClick={(e) => e.stopPropagation()} 
                    />
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
    }, [productos])


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
        rowSelection,
        selectionType,
        setSelectionType,
        loading,
        handleOk,
        isModalOpen,
        handleRowClick,
    };
};
