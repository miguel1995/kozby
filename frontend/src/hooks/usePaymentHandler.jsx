import { useOrder } from '../context/OrderContext';
import { useState, useEffect } from 'react';
import { postTransaccion } from '../services/transacciones.service';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../utils/authUtils';

export default function usePaymentHandler() {

    const { total, setPaymentMethod, setCash, items, clearOrder, discountsSelected, subTotal } = useOrder();
    const [enabled, setEnabled] = useState(false);
    const [errorData, setErrorData] = useState({
        codeError: null,
        isOpen: false
    });

    const [values, setValues] = useState({
        paymentMethod: {
            value: '',
            valid: false
        },
        cash: {
            value: '',
            valid: false
        }
    });

    const navigate = useNavigate();

    useEffect(() => {

        setEnabled(false);

        if (values.paymentMethod.valid) {
            if (values.paymentMethod.value === 'EFECTIVO') {
                if (values.cash.value > 0) {
                    setEnabled(true);
                } else {
                    setEnabled(false);
                }
            } else {
                setEnabled(true);
            }
        }
    }, [values]);

    const onChange = (e, name) => {
        if (e.target.value) {
            setValues({
                ...values,
                [name]: { value: e.target.value, valid: true }
            });
        }
    }


    const onSubmit = async () => {
        try {
            setPaymentMethod(values.paymentMethod.value);
            setCash(values.cash?.value || 0);
            const productoDescripcion = items.map(item => {
                let text = item.productName;
                if (item.cantidad > 1) {
                    text += ` x ${item.cantidad}`;
                }
                return text;
    
            }).join(', ');
    

            checkToken();
            await postTransaccion({
                total: total.toFixed(2),
                subtotal: subTotal.toFixed(2),            
                monto: (values.paymentMethod.value === 'EFECTIVO') ? values.cash?.value || 0 : total,
                cambio: (values.paymentMethod.value === 'EFECTIVO') ? (values.cash?.value || 0) - total : 0,
                productos_descripcion: productoDescripcion,
                descuentos: discountsSelected,                    
                tipo_pago: values.paymentMethod.value,
                productos: items.map(item => {
                    return {
                        cantidad: item.cantidad,
                        descuentos: item.discounts,
                        id: item.id,
                        notas: item.notes,
                        precio: item.precio,
                        producto_id: item.productId,
                        producto_nombre: item.productName,
                        variante_id: item.variantId,
                        variante_nombre: item.variantName
                    }
                })
    
            });
            clearOrder();
            alert('Transaccion realizada correctamente');
            navigate('/proceso-pagos');
            //TODO: descontar stock de productos

        } catch (error) {
            setErrorData({
                codeError: error.status || 500,
                isOpen: true
            });
        }
 
    }

    const handleOk = () => {
        setErrorData({
            codeError: null,
            isOpen: false
        });
    }

    return {
        total,
        enabled,
        onChange,
        values,
        onSubmit,
        errorData,
        handleOk
    }

}