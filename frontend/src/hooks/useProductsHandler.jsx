import React, { useState } from 'react';
import { productosIniciales } from '../utils/constants';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';

export const useProductsHandler = () => {
    const [productos, setProductos] = useState(productosIniciales);
    const [selectionType, setSelectionType] = useState('checkbox');

    const items = [
        { label: 'Editar', key: 'edit' },
        { label: 'Eliminar', key: 'delete' },
        { label: 'Ver más', key: 'more' },
    ];

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

    const tableData = productos.map((p) => ({ key: p.id, ...p }));

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
    };
};
