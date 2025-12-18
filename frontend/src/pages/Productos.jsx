import React, { useState } from 'react';
import { Divider, Radio, Table } from 'antd';


import { useProductsHandler } from '../hooks/useProductsHandler';


function Productos() {

    const [columns,
        tableData,
        rowSelection,
        selectionType,
        setSelectionType] = useProductsHandler();

    return (
        <div>
            <h1>Productos</h1>
            <Radio.Group onChange={(e) => setSelectionType(e.target.value)} value={selectionType}>
            </Radio.Group>
            <Divider />
            <Table rowSelection={{ type: selectionType, ...rowSelection }} columns={columns} dataSource={tableData} pagination={{ pageSize: 4 }} />
        </div>
    );
}

export default Productos;