import React, { useEffect, useState, useMemo } from 'react';
import { Divider, Radio, Table, Modal, Button, Space, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useProductsHandler } from '../hooks/useProductsHandler';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import MenuBar from '../components/MenuBar';
import SubmitButton from '../components/SubmitButton';
import { useLocation, useNavigate } from 'react-router';

function Productos() {

    const [search, setSearch] = useState('');

    const {
        columns,
        tableData,
        rowSelection,
        selectionType,
        isModalOpen,
        handleOk,
        setVerArchivados,
        verArchivados,
        isDeleteModalOpen,
        handleArchive,
        handleDeletePermanent,
        handleCancelDelete,
        handleRowClick
    } = useProductsHandler();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const esArchivos = location.pathname.includes('archivados');
        setVerArchivados(esArchivos);
    }, [location.pathname, setVerArchivados]);

    const modalFotterActions = useMemo(() => {

        const bottonDeleteStyle = {
            borderRadius: 40,
            padding: '12px 16px',
            backgroundColor: '#cf070a',
            borderColor: '#e00004',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 'bold'

        };

        const bottonStyle = {
            borderRadius: 40,
            padding: '12px 16px',
            backgroundColor: '#eeeded',
            borderColor: '#e9e2e2',
            fontSize: '15px',
            fontWeight: 'bold'

        };


        if (verArchivados) {
            return [
                <Button key="cancel" onClick={handleCancelDelete} style={bottonStyle}>
                    Cancelar

                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    color='red'
                    onClick={handleDeletePermanent}
                    style={bottonDeleteStyle}
                >
                    Eliminar permanentemente
                </Button>,
            ];
        } else {
            return [
                <Button key="cancel" onClick={handleCancelDelete} style={bottonStyle}>
                    Cancelar

                </Button>,
                <Button
                    key="archive"
                    type="default"
                    onClick={handleArchive}
                    style={bottonStyle}
                >
                    Archivar
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    color='red'
                    onClick={handleDeletePermanent}
                    style={bottonDeleteStyle}
                >
                    Eliminar permanentemente
                </Button>,
            ];
        }
    }, [verArchivados, handleCancelDelete, handleDeletePermanent, handleArchive]);



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

                    <SubmitButton
                        text="Crear Artículo"
                        onClick={() => navigate('/nuevo-producto')}
                    >Crear Artículo</SubmitButton>
                </div>


                <div className="products-table">
                    <Table
                        rowSelection={{ type: selectionType, ...rowSelection }}
                        columns={columns}
                        dataSource={tableData}
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => {
                            /* if (verArchivados) {
                                 return null
                             } else {
                                 return handleRowClick(record)
                             }*/
                            console.log('record: ', record);
                            return null;

                        }}
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


                <Modal
                    title={
                        <Space>
                            <span style={{ color: '#000000', fontSize: 20, fontWeight: 'bold' }}>Eliminar Articulo</span>
                        </Space>
                    }
                    closable={false}
                    open={isDeleteModalOpen.open}
                    onCancel={handleCancelDelete}
                    footer={modalFotterActions}
                    modalRender={modal => (
                        <div style={{ borderRadius: 20, overflow: 'hidden' }}>
                            {modal}
                        </div>
                    )}
                >


                    <div style={{ marginBottom: '20px' }}>
                        <p>
                            ¿Está seguro que desea eliminar el artículo <strong>{isDeleteModalOpen.nombre}</strong>? Las transacciones asociadas a este artículo se perderán.
                        </p>

                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <p>
                            Si desea archivar el producto, este se ocultará de la lista, pero no perderá ningún dato asociado; podrá restaurarlo en cualquier momento.
                        </p>


                    </div>


                </Modal>
            </div>
        </div>

    );
}

export default Productos;
