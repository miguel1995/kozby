import React, { useEffect, useState, useMemo } from 'react';

import { useProductsHandler } from '../hooks/useProductsHandler';
import { SearchInput } from '../components/SearchInput';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { useLocation, useNavigate } from 'react-router';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import ListProductos from '../components/ListProductos';
import { canAccess } from '../utils/authUtils';

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

        const filteredProductos = useMemo(() => {
            const term = search.trim().toLowerCase();
            if (!term) return productos;
            return productos.filter((p) => {
                const searchable = [p?.nombre, p?.descripcion, String(p?.precio ?? ''), String(p?.cantidad ?? '')]
                    .join(' ')
                    .toLowerCase();
                return searchable.includes(term);
            });
        }, [productos, search]);

    useEffect(() => {
        const esArchivos = location.pathname.includes('archivados');
        setVerArchivados(esArchivos);
    }, [location.pathname, setVerArchivados]);

  


    return (
        <div className="page-container">
            <div className="products-page">
                <div className="products-page-filters-and-actions">
                    <SearchInput
                        placeholder="Buscar"
                        className="products-page-search-input"
                        value={search}
                        onChange={setSearch}
                    />
                    {verArchivados ? (
                        <div className="products-page-archived-title">Artículos archivados</div>
                    ) : (
                        
                        canAccess() && (
                        <SubmitButton
                        text="Crear Artículo"
                        onClick={() => navigate('/nuevo-producto')}
                    />
                    )
                    )}
                   
                </div>


                <div className="products-table">
                    {loading ? (
                        <Loader message="Cargando productos..." />
                    ) : (      
                        <ListProductos 
                        productos={filteredProductos} 
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
