import React, { useEffect, useState, useMemo } from 'react';
import { Divider, Radio, Table, Modal, Button, Space, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useProductsHandler } from '../hooks/useProductsHandler';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import MenuBar from '../components/MenuBar';
import {SubmitButton} from '../components/buttons/SubmitButton';
import { useLocation, useNavigate } from 'react-router';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { ButtonDanger } from '../components/buttons/ButtonDanger';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
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
        loading,
        handleArchive,
        handleDeletePermanent,
        handleCancelDelete,
        handleRowClick,
    } = useProductsHandler();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const esArchivos = location.pathname.includes('archivados');
        setVerArchivados(esArchivos);
    }, [location.pathname, setVerArchivados]);

    const modalFotterActions = useMemo(() => {

    
        if (verArchivados) {
            return [
                <ButtonSecundary
                    key="cancel"
                    onClick={handleCancelDelete}
                    label="Cancelar"
                />,   
                <ButtonDanger
                    key="delete"
                    onClick={handleDeletePermanent}
                    label="Eliminar permanentemente"
                />
            ];
        } else {
            return [
                <ButtonSecundary
                    key="cancel"
                    onClick={handleCancelDelete}
                    label="Cancelar"
                />,                   
                <ButtonSecundary
                    key="archive"
                    onClick={handleArchive}
                    label="Archivar"
                />,
                <ButtonDanger
                    key="delete"
                    onClick={handleDeletePermanent}
                    label="Eliminar permanentemente"
                />
            ];
        }
    }, [verArchivados, handleCancelDelete, handleDeletePermanent, handleArchive]);



    return (
        <div className="page-container">
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
                        />
                </div>


                <div className="products-table">
                    {loading ? (
                        <Loader message="Cargando productos..." />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            pagination={{ pageSize: 10 }}
                        />
                    )}
                </div>

                <ModalError
                    open={isModalOpen}
                    onOk={handleOk}
                />


                <Modal
                    title={
                        <Space>
                            <span style={{ color: '#000000', fontSize: 20, fontWeight: 'bold' }}>Eliminar Artículo</span>
                        </Space>
                    }
                    className="modal-delete-product"
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
