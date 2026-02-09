import React, { useEffect, useState, useMemo } from 'react';
import { Divider, Radio, Table, Modal, Button, Space, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useProductsHandler } from '../hooks/useProductsHandler';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import MenuBar from '../components/MenuBar';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { useLocation, useNavigate } from 'react-router';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { ButtonDanger } from '../components/buttons/ButtonDanger';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { ButtonAmount } from '../components/buttons/ButtonAmount';
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
        productos,
        hacerClick
    } = useProductsHandler();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const esArchivos = location.pathname.includes('archivados');
        setVerArchivados(esArchivos);
    }, [location.pathname, setVerArchivados]);

  


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
                    {verArchivados ? (
                        <div className="products-page-archived-title">Artículos archivados</div>
                    ) : (
                        <SubmitButton
                        text="Crear Artículo"
                        onClick={() => navigate('/nuevo-producto')}
                    />
                    )}
                   
                </div>


                <div className="products-table">
                    {loading ? (
                        <Loader message="Cargando productos..." />
                    ) : (<>        
                        {<div className="productos-list">
                            {productos.map((producto) => (
                                <div key={producto.id}>
                                    <div className="producto-item" onClick={() => { hacerClick("edit", producto) }}>
                                        <div className="producto-item-info-container" >
                                            <div>
                                                <img src={producto.imagen} alt="" style={{ width: 39, height: 'auto', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <div className="producto-item-nombre">{producto.nombre}</div>
                                                <div className="producto-item-precio">$ {producto.precio}</div>
                                                <ButtonAmount amount={producto.cantidad} clickHandler={() => { }} />
                                            </div>

                                        </div>
                                        <div>
                                            <div className="producto-item-cantidad">
                                                {producto.variantes.length > 0 ? <div>{producto.variantes.length} precios</div> : <div>Variable</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                </div>
                            ))}
                        </div>}
                    </>
                    )}
                </div>

                <ModalError
                    open={isModalOpen}
                    onOk={handleOk}
                />


            </div>
        </div>

    );
}

export default Productos;
