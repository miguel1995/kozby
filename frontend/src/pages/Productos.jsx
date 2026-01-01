import React, { useEffect, useState } from 'react';
import { Divider, Radio, Table, Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useProductsHandler } from '../hooks/useProductsHandler';

function Productos() {
    const { 
        columns,
        tableData,
        rowSelection,
        selectionType,
        error,
        isModalOpen,
        handleOk,
        showModal,
        setSelectionType,
        isDeleteModalOpen,
        selectedProduct,
        handleArchive,
        handleDeletePermanent,
        handleCancelDelete,
    } = useProductsHandler();

    useEffect(() => {
        if (error) {
            showModal();
        }
    }, [error]);

    return (
        <div>
            <h1>Productos</h1>
            <Radio.Group onChange={(e) => setSelectionType(e.target.value)} value={selectionType}>
            </Radio.Group>
            <Divider />
            <Table 
                rowSelection={{ type: selectionType, ...rowSelection }} 
                columns={columns} 
                dataSource={tableData} 
                pagination={{ pageSize: 4 }} 
            />
            
            {/* Modal de error de servicio */}
            <Modal
                title="Fuera de servicio"
                closable={false}
                open={isModalOpen}
                onOk={handleOk}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>Lo sentimos, en este momento el servicio no esta disponible</p>
                <p>Por Favor intentelo mas tarde</p>
            </Modal>

            {/* Modal de confirmación de eliminación */}
            <Modal
                title={
                    <Space>
                        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                        <span>Confirmar eliminación</span>
                    </Space>
                }
                open={isDeleteModalOpen}
                onCancel={handleCancelDelete}
                footer={[
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
                ]}
            >
                <div style={{ marginBottom: '16px' }}>
                    <p>
                        <strong>¿Qué desea hacer con el producto "{selectedProduct?.nombre}"?</strong>
                    </p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <p><strong>Opción 1: Archivar</strong></p>
                    <p style={{ marginLeft: '16px', color: '#666' }}>
                        El producto se ocultará de la lista pero se conservará en el sistema. 
                        Podrás recuperarlo más tarde.
                    </p>
                </div>
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff2e8', borderRadius: '4px' }}>
                    <p><strong>Opción 2: Eliminar permanentemente</strong></p>
                    <p style={{ marginLeft: '16px', color: '#d4380d', fontWeight: 'bold' }}>
                        ⚠️ ADVERTENCIA: Si decides eliminar permanentemente este producto, 
                        todas las transacciones relacionadas serán eliminadas y NO se podrán recuperar.
                    </p>
                </div>
            </Modal>
        </div>
    );
}

export default Productos;