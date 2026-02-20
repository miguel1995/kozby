import React, { useEffect, useState } from 'react';

import { useProductsHandler } from '../hooks/useProductsHandler';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { useLocation, useNavigate } from 'react-router';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import ListProductos from '../components/ListProductos';
import {Input} from 'antd';


function Productos() {

    const [search, setSearch] = useState('');

    const {
        errorData,
        handleOk,
        setVerArchivados,
        verArchivados,
        loading,
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
                    ) : (      
                        <ListProductos 
                        productos={productos} 
                        hacerClickCallback={hacerClick}
                        clickAction="edit"
                        />
                    
                    )}
                </div>

                <ModalError
                    open={errorData.isOpen}
                    errorCode={errorData.codeError}
                    onOk={handleOk}
                />


            </div>
        </div>

    );
}

export default Productos;
