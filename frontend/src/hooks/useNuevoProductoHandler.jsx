import React, { useState, useEffect } from 'react';
import { postProducto } from '../services/productos.service';
import { initialFormValues } from '../utils/constants';
import { useNavigate } from 'react-router';

export const useNuevoProductoHandler = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFormValid, setIsFormValue] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialFormValues);
    const navigate = useNavigate();


    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        if (error) {
            showModal()
        }
    }, [error])


    useEffect(() => {
        console.log(values);
        setIsFormValue(Object.values(values).every(field => field.valid === true));
    }, [values]);


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

        createNewProduct({
            nombre: values.nombre.value,
            precio: values.precio.value,
            descripcion: values.descripcion.value,
            imagen: values.imagen.value,
            categoria_id: 1 // TODO: get categoria_id from the dropdown
        });

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
