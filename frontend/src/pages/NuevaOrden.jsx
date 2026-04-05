import { Input, Radio, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { usePaymentProcess } from '../hooks/usePaymentProcess';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useOrder } from '../context/OrderContext';
import { ModalError } from '../components/modals/ModalError';
import { message } from 'antd';
import { ButtonAmount } from '../components/buttons/ButtonAmount';
const NuevaOrden = () => {
    const navigate = useNavigate();
    const { 
        product, 
        errorData, 
        loading, 
        handleOk,
        handleAddProduct,
        total,
        amount,
        values,
        setAmount,
        onChange,
    } = usePaymentProcess();


    
    return (
        <div className='nueva-orden'>
            <div className='nueva-orden__header'>
                <div><CloseOutlined
                    onClick={() => navigate('/proceso-pagos')}
                /></div>
                <div>{product.nombre} ${total.toFixed(2)}</div>
                <div onClick={() => {
                    if (Number(values.currentVariant.value?.cantidad) >= amount) {
                        handleAddProduct();
                    } else {
                        message.error('No hay suficiente stock');
                    }
                }}
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
                            <span className='nueva-orden__body--variant--nombre'>{variante.nombre} <span> <ButtonAmount amount={variante.cantidad} showLabel={false} /> </span> </span> 
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
                        
                            <PlusOutlined onClick={
                                () => 
                                {
                                        setAmount(amount + 1);
                                    
                                }
                                } className='nueva-orden__body-plus' />

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
            <ModalError
                open={errorData.isOpen}
                errorCode={errorData.codeError}
                onOk={handleOk}
            />
        </div>
    );
};

export default NuevaOrden;