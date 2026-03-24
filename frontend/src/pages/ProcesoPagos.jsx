import React, { useEffect, useState } from 'react';
import { useProductsHandler } from '../hooks/useProductsHandler';
import ListProductos from '../components/ListProductos';
import Loader from '../components/Loader';
import { ModalError } from '../components/modals/ModalError';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { useNavigate } from 'react-router';
import { useOrder } from '../context/OrderContext';
import { Segmented } from 'antd';
import Teclado from '../components/Teclado';
import { OTRO_IMPORTE } from '../utils/constants';



const ProcesoPagos = () => {

    const { items } = useOrder();
    const [total, setTotal] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [valueSegment, setValueSegment] = useState('Surtido');

    useEffect(() => {
        const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        const totalAmount = items.reduce((acc, item) => acc + item.cantidad, 0);
        setTotal(total);
        setTotalAmount(totalAmount);
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

    const handlePlus = (price) => {
        hacerClick('nueva-orden', { precio: price, cantidad: 1, nombre: OTRO_IMPORTE.nombre, id: OTRO_IMPORTE.id, variantes: [], variantId: "" });
    }

    return (
        <div className='proceso-pagos'>
<div className='proceso-pagos__header'>
            <Segmented options={['Teclado', 'Surtido']} value={valueSegment} onChange={setValueSegment} />
</div>
            {valueSegment === 'Teclado' && <Teclado handlePlus={handlePlus} />}

            {valueSegment === 'Surtido' && <>
                <div className='proceso-pagos__body'>

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

                </div>
            </>}
            <div className="charge-button">
                <SubmitButton
                    onClick={() => {

                        if (total > 0) {
                            navigate('/cobro');
                        }
                    }}
                    text={(total > 0) ?
                        <>
                            <div>Revisar venta</div>
                            <div>{totalAmount} artículos</div>
                        </>
                        : `Cobrar $0.00`}
                    disabled={total === 0}
                />
            </div>
            <ModalError
                open={isModalOpen}
                onOk={handleOk}
            />

        </div>
    )
}

export default ProcesoPagos;