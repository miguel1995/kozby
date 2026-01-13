import React, { useEffect, useState } from 'react';
import { Divider, Radio, Table, Space, Input } from 'antd';
import { Button, Modal } from 'antd';



import { useProductsHandler } from '../hooks/useProductsHandler';
import { useNavigate } from 'react-router';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import MenuBar from '../components/MenuBar';


function Productos() {

    const [search, setSearch] = useState('');

    const { columns,
        tableData,
        rowSelection,
        selectionType,
        isModalOpen,
        handleOk,
        setSelectionType,
        handleRowClick } = useProductsHandler();

    const navigate = useNavigate();


    return (
        <div className="page-container">
            <MenuBar />
            <div className="products-page">
                <div className="products-page-filters-and-actions">
                    <Input placeholder="Buscar"
                        className="products-page-search-input"
                        prefix={<SearchOutlined />}
                        suffix={search ? <CloseOutlined onClick={() => setSearch('')} /> : null}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button
                        onClick={() => navigate('/nuevo-producto')}
                        className="create-product-button"
                    >Crear Artículo</Button>
                </div>


                <div className="products-table">
                    <Table
                        rowSelection={{ type: selectionType, ...rowSelection }}
                        columns={columns}
                        dataSource={tableData}
                        pagination={{ pageSize: 10 }}
                        onRow={handleRowClick}
                    />
                </div>
                <Modal
                    title="Fuera de servicio"
                    closable={false}
                    open={isModalOpen}
                    onOk={handleOk}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <p>Lo sentimos, en este momento el servicio no está disponible</p>
                    <p>Por Favor intentelo más tarde</p>
                </Modal>

            </div>
        </div>

    );
}

export default Productos;