import React, { useEffect, useState } from 'react';
import { useProductsHandler } from '../hooks/useProductsHandler';
import ListProductos from '../components/ListProductos';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { useNavigate } from 'react-router';
import { useOrder } from '../context/OrderContext';

const ProcesoPagos = () => {

    const { items } = useOrder();
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        setTotal(total);
    }, [items]);

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
                    onClick={() => {

                        if (total > 0) {
                            navigate('/cobro');
                        }
                    }}
                    label={(total > 0) ? 
                        <>
                        <div>Revisar venta</div>
                        <div>{items.length} artículos</div>
                    </>
                     : `Cobrar $0.00`}
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