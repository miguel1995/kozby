import React, { useState, useEffect } from 'react';
import { postProducto, getProductoById, putProducto } from '../services/productos.service';
import { initialFormValues } from '../utils/constants';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

export const useFormProductoHandler = (isEditMode = false) => {

    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFormValid, setIsFormValue] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialFormValues);
    const navigate = useNavigate();

    useEffect(() => {
        if (id && isEditMode) {
            fetchProducto(id);
        }
    }, [id, isEditMode]);

    useEffect(() => {
        if (error) {
            showModal()
        }
    }, [error])


    useEffect(() => {
        console.log(values);
        setIsFormValue(Object.values(values).every(field => field.valid === true));
    }, [values]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const fetchProducto = async (id) => {
        setLoading(true);
        try {
            const data = await getProductoById(id);
            setValues({
                nombre: { value: data.nombre, valid: true },
                precio: { value: data.precio, valid: true },
                descripcion: { value: data.descripcion, valid: true },
                imagen: { value: data.imagen, valid: true }
            });
            setIsFormValue(true);
        } catch (err) {
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };


    const createNewProduct = async (productoData) => {
        setLoading(true);
        try {
            const data = await postProducto(productoData);
            navigate('/productos');
        } catch (err) {
            console.error('Error al crear producto:', err);
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id, productoData) => {
        setLoading(true);
        try {
            const data = await putProducto(id, productoData);
            navigate('/productos');
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        console.log(e);
        setValues({
            ...values,
            [e.target.name]: {
                value: e.target.value,
                valid: e.target.value != ""
            }
        });
    }

    const handleSubmit = () => {


        if (isEditMode) {
            updateProduct(id, {
                nombre: values.nombre.value,
                precio: values.precio.value,
                descripcion: values.descripcion.value,
                imagen: values.imagen.value,
                categoria_id: 1 // TODO: get categoria_id from the dropdown
            });
        } else {
            createNewProduct({
                nombre: values.nombre.value,
                precio: values.precio.value,
                descripcion: values.descripcion.value,
                imagen: values.imagen.value,
                categoria_id: 1 // TODO: get categoria_id from the dropdown
            });
        }
    }


    return {
        loading,
        handleOk,
        isModalOpen,
        isFormValid,
        handleChange,
        handleSubmit,
        values
    };
};
