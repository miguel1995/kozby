import React, { useEffect } from 'react';
import { useProductsHandler } from '../hooks/useProductsHandler';
import ListProductos from '../components/ListProductos';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { useNavigate } from 'react-router';

const ProcesoPagos = () => {

    const {
        isModalOpen,
        handleOk,
        loading,
        productos,
        hacerClick,
        setVerArchivados
    } = useProductsHandler();

    const navigate = useNavigate();

    useEffect(() => {
        setVerArchivados(false);
    }, []);

    return (
        <>
            <div className="products-table">
                {loading ? (
                    <Loader message="Cargando productos..." />
                ) : (
                    <ListProductos
                        productos={productos}
                        hacerClickCallback={hacerClick}
                        clickAction="nueva-orden"
                    />

                )}
            </div>
            <div className="create-article-new"
            onClick={() => { 
                navigate('/nuevo-producto');
             }}
            ><span>Crear articulo nuevo</span></div>
            <div className="charge-button">
                <ButtonSecundary
                    onClick={() => { navigate('/cobro'); }}
                    label="Cobrar $0.00"
                />
            </div>
            <ModalError
                open={isModalOpen}
                onOk={handleOk}
            />

        </>
    )
}

export default ProcesoPagos;