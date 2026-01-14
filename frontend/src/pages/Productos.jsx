import React, { useEffect, useState } from 'react';
import { Divider, Radio, Table, Modal, Button, Space, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useProductsHandler } from '../hooks/useProductsHandler';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import MenuBar from '../components/MenuBar';
import SubmitButton from '../components/SubmitButton';
import { useLocation, useNavigate } from 'react-router';

function Productos() {

    const [search, setSearch] = useState('');
    const [modalFotterActions, setModalFotterActions] = useState([]);
  

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
    }, []);

    useEffect(() => {
        if (verArchivados) {
            setModalFotterActions([
                <Button key="cancel" onClick={handleCancelDelete}>
                    Cancelar
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    danger
                    onClick={handleDeletePermanent}
                >
                    Eliminar permanentemente
                </Button>,
            ]);
        } else {
            setModalFotterActions([
                <Button key="cancel" onClick={handleCancelDelete}>
                    Cancelar
                </Button>,
                <Button
                    key="archive"
                    type="default"
                    onClick={handleArchive}
                >
                    Archivar
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    danger
                    onClick={handleDeletePermanent}
                >
                    Eliminar permanentemente
                </Button>,
            ]);
        }
    }, [verArchivados, handleDeletePermanent, handleArchive]);



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
                            /*if (verArchivados) {
                                return null
                            } else {
                                return handleRowClick(record)
                            }*/
                           console.log('En construcción');
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
                            <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                            <span>Confirmar eliminación</span>
                        </Space>
                    }
                    open={isDeleteModalOpen.open}
                    onCancel={handleCancelDelete}
                    footer={modalFotterActions}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <p>
                            <strong>
                                ¿Qué desea hacer con el producto "{isDeleteModalOpen.nombre}"?
                            </strong>
                        </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <p><strong>Opción 1: Archivar</strong></p>
                        <p style={{ marginLeft: '16px', color: '#666' }}>
                            El producto se ocultará de la lista pero se conservará en el sistema.
                            Podrás recuperarlo más tarde.
                        </p>
                    </div>

                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '12px',
                            backgroundColor: '#fff2e8',
                            borderRadius: '4px',
                        }}
                    >
                        <p><strong>Opción 2: Eliminar permanentemente</strong></p>
                        <p
                            style={{
                                marginLeft: '16px',
                                color: '#d4380d',
                                fontWeight: 'bold',
                            }}
                        >
                            ⚠️ ADVERTENCIA: Si decides eliminar permanentemente este producto,
                            todas las transacciones relacionadas serán eliminadas y NO se podrán recuperar.
                        </p>
                    </div>
                </Modal>
            </div>
        </div>

    );
}

export default Productos;
