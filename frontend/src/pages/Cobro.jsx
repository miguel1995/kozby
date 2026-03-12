import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { ButtonClose } from '../components/buttons/ButtonClose';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
import { Divider } from 'antd';
import { SubmitButton } from '../components/buttons/SubmitButton';



const Cobro = () => {

    const navigate = useNavigate();
    const { items, total, clearOrder } = useOrder();

    useEffect(() => {
        console.log(items);
    }, [items]);


    
    return (
        <div className="cobro__container">
            <div className="cobro__header">
                <div>

                    <ButtonClose
                        onClick={() => navigate(-1)}
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
                    <div key={item.id} className="cobro__item">
                        <div >
                            <div className="cobro__item--name-container">
                                <div className="cobro__item--name">{item.productName}</div> x <div className="cobro__item-quantity">{item.cantidad}</div>
                            </div>
                            <div>
                                <div className="cobro__item--variant">{item.variantName}</div>
                            </div>
                        </div>

                        <div className="cobro__item--price">${item.cantidad * item.precio}</div>
                    </div>
                ))}
            </div>
            <Divider />
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