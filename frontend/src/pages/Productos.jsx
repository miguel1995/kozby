import React, { useEffect, useState } from 'react';
import { Divider, Radio, Table } from 'antd';
import { Button, Modal } from 'antd';



import { useProductsHandler } from '../hooks/useProductsHandler';


function Productos() {

    const { columns,
        tableData,
        rowSelection,
        selectionType,
        error,
        isModalOpen,
        handleOk,
        showModal,
        setSelectionType } = useProductsHandler();
    useEffect(() => {
        if (error) {
            showModal()
        }
    }, [error])
    


    return (
        <div>
            <h1>Productos</h1>
            <Radio.Group onChange={(e) => setSelectionType(e.target.value)} value={selectionType}>
            </Radio.Group>
            <Divider />
            <Table rowSelection={{ type: selectionType, ...rowSelection }} columns={columns} dataSource={tableData} pagination={{ pageSize: 4 }} />
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

        </div>
    );
}

export default Productos;