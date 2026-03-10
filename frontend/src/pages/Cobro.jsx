import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { ButtonClose } from '../components/buttons/ButtonClose';
import { ButtonSecundary } from '../components/buttons/ButtonSecundary';
const Cobro = () => {

const navigate = useNavigate();
const { items } = useOrder();

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
                        onClick={() => navigate(-1)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Cobro;