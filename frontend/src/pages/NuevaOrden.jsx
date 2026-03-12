import { Input, Radio, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { usePaymentProcess } from '../hooks/usePaymentProcess';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useOrder } from '../context/OrderContext';


const NuevaOrden = () => {
    const navigate = useNavigate();
    const { addProduct } = useOrder();
    const { product, errorData, loading } = usePaymentProcess();
    const [values, setValues] = useState({
        currentVariant: {
            value: null,
            valid: false,
        },
        amount: {
            value: 1,
            valid: true,
        },
        notes: {
            value: '',
            valid: true,
        },
        discounts: {
            value: '',
            valid: true,
        },
    });
    const [total, setTotal] = useState(0.00);

    const [amount, setAmount] = useState(1);


    useEffect(() => {

        onChange('amount', amount);

    }, [amount]);
    useEffect(() => {
        if (values.currentVariant.value && values.amount.value) {
            const total = values.currentVariant.value?.precio * values.amount.value;
            setTotal(total);
        }
    }, [values.currentVariant.value, values.amount.value]);

    useEffect(() => {
        if (product.variantes && product.variantes.length > 0) {
            onChange('currentVariant', product.variantes[0]);
        }
    }, [product.variantes])


    const onChange = (name, value) => {
        setValues({
            ...values,
            [name]: {
                value: value,
                valid: true,
            },
        });
    };

    const handleAddProduct = () => {
        if (values.currentVariant.valid && values.amount.valid && values.currentVariant.value) {
            const variante = values.currentVariant.value;
            addProduct({
                productId: product.id,
                productName: product.nombre,
                variantId: variante.id,
                variantName: variante.nombre,
                precio: variante.precio,
                cantidad: amount,
                notes: values.notes.value,
                discounts: values.discounts.value,
            });
            navigate('/proceso-pagos');
        }
    }

    return (
        <div className='nueva-orden'>
            <div className='nueva-orden__header'>
                <div><CloseOutlined
                    onClick={() => navigate('/proceso-pagos')}
                /></div>
                <div>{product.nombre} ${total.toFixed(2)}</div>
                <div onClick={() => handleAddProduct()}
                    className='nueva-orden__header--add'
                >Agregar</div>
            </div>

            <div className='nueva-orden__body'>


                <div className='nueva-orden__body--row'>
                    <span className='nueva-orden__body--title'>
                        {product.nombre}
                    </span>
                    {' '}
                    <span>
                        ELEGIR UNO
                    </span>
                </div>
                <Divider className='nueva-orden__body--divider' />

                <div className='nueva-orden__body--row'>
                    {product.variantes && product.variantes.map(variante => (
                        <div
                            key={variante.id}
                            className='nueva-orden__body--variant'
                            onChange={() => onChange('currentVariant', variante)}
                        >
                            <span>{variante.nombre}</span>
                            <div className='nueva-orden__body--row--price'>
                                <span>${variante.precio}</span>
                                <Radio
                                    value={variante.id}
                                    onChange={() => onChange('currentVariant', variante)}
                                    checked={values.currentVariant.value?.id === variante.id}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <Divider className='nueva-orden__body--divider' />


                <div className='nueva-orden__body--row'>
                    <div className='nueva-orden__body--title'>
                        Cantidad
                    </div>

                    <div className='nueva-orden__body--row--amount'>
                        <MinusOutlined onClick={() => {

                            if (amount > 1) {
                                setAmount(amount - 1);
                            }

                        }}
                            className='nueva-orden__body-minus' />
                        <span className='nueva-orden__body-amount'>
                            {amount}
                        </span>
                        <PlusOutlined onClick={() => setAmount(amount + 1)} className='nueva-orden__body-plus' />
                    </div>

                </div>
                <Divider className='nueva-orden__body--divider' />
                <div className='nueva-orden__body--row'>
                    <div className='nueva-orden__body--title'>
                        Notas
                    </div>
                    <Input.TextArea
                        maxLength={100}
                        onChange={(e) => onChange('notes', e.target.value)}
                        showCount
                        value={values.notes.value}
                    />
                </div>
                <Divider className='nueva-orden__body--divider' />
                <div className='nueva-orden__body--row'>
                    <div className='nueva-orden__body--title'>
                        Descuentos
                    </div>
                    <Divider className='nueva-orden__body--divider' />

                </div>
                {
                    product.descripcion && (
                        <div className='nueva-orden__body--row'>
                            <div className='nueva-orden__body--title'>
                                Descripcion del articulo
                            </div>
                            {product.descripcion}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default NuevaOrden;