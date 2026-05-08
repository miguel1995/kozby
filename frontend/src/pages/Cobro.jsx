import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { ButtonClose } from '../components/buttons/ButtonClose';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { Divider } from 'antd';
import { SubmitButton } from '../components/buttons/SubmitButton';



const Cobro = () => {

    const navigate = useNavigate();
    const { items, total, clearOrder, discountsCalculated } = useOrder();

    return (
        <div className="cobro__container">
            <div className="cobro__header">
                <div>

                    <ButtonClose
                        onClick={() => navigate('/proceso-pagos')}
                    />

                </div>

                <div>
                    Venta actual ( {items.length} )
                </div>
                <div>
                    <ButtonSecundary
                        label="Eliminar artículos"
                        onClick={() => clearOrder()}
                    />
                </div>
            </div>
            <div className="cobro__body">
                {items.map((item) => (
                    <div key={item.id}
                        className="cobro__item"
                        onClick={

                            () => {
                                navigate(`/editar-nueva-orden/${item.productId}?itemId=${item.id}`)
                            }
                        }
                    >
                        <div >
                            <div className="cobro__item--name-container">
                                <div className="cobro__item--name">{item.productName}</div> x <div className="cobro__item-quantity">{item.cantidad}</div>
                            </div>
                            <div>
                                <div className="cobro__item--variant">{item.variantName}</div>
                            </div>
                        </div>

                        <div className="cobro__item--price">${item.total.toFixed(2)}</div>
                    </div>
                ))}
            </div>
            <Divider />
            {discountsCalculated > 0 && (
                <>
                    <div className="cobro__discounts"
                        onClick={() => navigate('/agregar-descuento')}

                    >
                        <div className="cobro__discounts--title">Descuentos</div>
                        <div className="cobro__discounts--amount">${discountsCalculated.toFixed(2)}</div>
                    </div>

                    <Divider />
                </>


            )}
            {items.length > 0 && (
                <div
                    className="cobro__agregar-descuento"
                    onClick={() => navigate('/agregar-descuento')}
                >
                    Agregar descuento
                </div>
            )}
            <div className="cobro__total">
                <SubmitButton
                    text={`Cobrar $${total.toFixed(2)}`}
                    onClick={() => navigate('/metodo-pago')}
                    disabled={total === 0}
                />
            </div>
        </div>
    );
};

export default Cobro;