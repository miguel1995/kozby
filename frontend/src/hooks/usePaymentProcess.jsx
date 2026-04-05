import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkToken } from '../utils/authUtils';
import { getProductoById } from '../services/productos.service';
import { useOrder } from '../context/OrderContext';

export const usePaymentProcess = () => {
    const { addProduct } = useOrder();
    const navigate = useNavigate();

    const { id } = useParams();
    const [product, setProduct] = useState({
        id: null,
        nombre: null,
        precio: null,
        cantidad: null,
        descripcion: null,
        imagen: null,
        variantes: null
    });
    const [errorData, setErrorData] = useState({
        codeError: null,
        isOpen: false
    });
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0.00);

    const [amount, setAmount] = useState(1);

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

    useEffect(() => {
        if (id) {
            fetchProducto(id);
        }
    }, [id]);


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

    const handleOk = () => {
        setErrorData({
            codeError: null,
            isOpen: false
        });
    }

    const fetchProducto = async (id) => {
        setLoading(true);
        try {
            checkToken();
            const data = await getProductoById(id);

               
                setProduct({
                    id: data.id,
                    nombre: data.nombre,
                    precio: data.precio,
                    cantidad: data.cantidad,
                    descripcion: data.descripcion,
                    imagen: data.imagen,
                    variantes: data.variantes
                });
        } catch (err) {
            setErrorData({
                codeError: err.status || 500,
                isOpen: true
            });

        } finally {
            setLoading(false);
        }
    };

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


    return {
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
    }
}
   