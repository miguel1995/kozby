import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkToken } from '../utils/authUtils';
import { getProductoById } from '../services/productos.service';
import { useOrder } from '../context/OrderContext';
import { getDescuentos } from '../services/descuentos.service';
import { useSearchParams } from 'react-router-dom';

export const usePaymentProcess = (isEditMode = false) => {
    const { addProduct, addDiscount, removeDiscount, discountsSelected, items } = useOrder();
    const navigate = useNavigate();
    const [descuentos, setDescuentos] = useState([]);
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get('itemId');

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
        }
    });

useEffect(() => {
    console.log('>>> values', values);
}, [values]);

    useEffect(() => {
        if (id) {
            fetchProducto(id);
        }
    }, [id]);

    useEffect(() => {
        fetchDescuentos();
    }, []);


    useEffect(() => {
        console.log('>>> amount', amount);
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

    useEffect(() => {
        console.log('>>> product', product);
        if (product.id && isEditMode && itemId) {

            console.log('>>> itemId', itemId);

            const item = items.find(item => item.id === itemId);
            console.log('>>> item', item);

            if (item) {

                if (item.variantId) {
                    const filteredVariantes = product.variantes.find(
                        variant => variant.id === item.variantId
                    );
                    console.log('>>> filteredVariantes', filteredVariantes);
                    onChange('currentVariant', filteredVariantes);
                }
                if (item.cantidad) {
                    setAmount(item.cantidad);
                }
                if (item.notes) {
                    onChange('notes', item.notes);
                }

                /*setValues({
                    currentVariant: {
                        value: item.variantId,
                        valid: true,
                    },
                    amount: {
                        value: item.cantidad,
                        valid: true,
                    },
                    notes: {
                        value: item.notes,
                        valid: true,
                    },
                    discounts: {
                        value: item.discounts,
                        valid: true,
                    },
                });*/
            }
        }
    }, [product, isEditMode, items, itemId]);

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

        console.log('>>> onChange', name, value);

        if (name === 'discounts') {
            if (value.action === 'ADD_DISCOUNT') {
                addDiscount(value.discount);
            }
            else if (value.action === 'REMOVE_DISCOUNT') {
                removeDiscount(value.discount.id);
            }
        }
        else {
            setValues({
                ...values,
                [name]: {
                    value: value,
                    valid: true,
                },
            });
        }

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
                total: total,
            });
            navigate('/proceso-pagos');
        }
    }

    const fetchDescuentos = async () => {
        setLoading(true);
        try {
            checkToken();
            const data = await getDescuentos();
            setDescuentos(data);
        } catch (err) {
            setErrorData({
                codeError: err.status || 500,
                isOpen: true
            });
        } finally {
            setLoading(false);
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
        descuentos,
        discountsSelected
    }
}
