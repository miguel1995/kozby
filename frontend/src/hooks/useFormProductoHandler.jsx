import React, { useState, useEffect } from 'react';
import { postProducto, getProductoById, putProducto } from '../services/productos.service';
import { initialFormValues } from '../utils/constants';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

export const useFormProductoHandler = (isEditMode = false) => {

    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [values, setValues] = useState(initialFormValues);
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [fechaModificacion, setFechaModificacion] = useState('');
    const [showFormErrors, setShowFormErrors] = useState(false);
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
        // Validar que todos los campos requeridos tengan valores válidos
        setIsFormValid(Object.values(values).every(field => {
            if (field.required===true) {
                return field.valid===true;
            } else {
                return true;
            }   
        }));
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
                cantidad: { value: data.cantidad, valid: true },
                descripcion: { value: data.descripcion, valid: true },
                imagen: { value: data.imagen, valid: true }
            });

            setFechaCreacion(data.fecha_creacion);
            setFechaModificacion(data.fecha_modificacion);

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
        setShowFormErrors(false);

        // Manejar tanto inputs normales como File objects
        const fieldName = e.target.name;
        if (!fieldName) {
            console.warn("El evento de cambio no tiene un nombre de campo válido.");
            return;
        }
        let fieldValue;
        let isValid;
        let error;

        

        if (e.target.files && e.target.files[0]) {
            // Si es un input de tipo file
            fieldValue = e.target.files[0];
            isValid = true; // Un archivo seleccionado es válido
            error = null;
        } else if (e.target.value !== undefined) {
            // Si es un input normal
            fieldValue = e.target.value;
            isValid = fieldValue != "";
            error = (fieldValue != "") ? null : "Ingrese un valor valido en " + fieldName;
        } else if (e.target instanceof File || e.target?.value instanceof File) {
            // Si se pasa directamente un File object (desde ImageUpload)
            fieldValue = e.target.value || e.target;
            isValid = true;
            error = null;

        } else {
            // Fallback: usar e.target.value
            fieldValue = e.target.value;
            isValid = fieldValue != "";
            error = (fieldValue != "") ? null : "Ingrese un valor valido en " + fieldName;
        }


        const isFieldRequired = values[fieldName].required;
        

        setValues({
            ...values,
            [fieldName]: {
                value: fieldValue,
                valid: isFieldRequired ? isValid : true,
                error: isFieldRequired ? error : null,
                required: isFieldRequired
            }
        });
    }

    const handleSubmit = () => {
        console.log("Guardar producto: ");
        console.log(isFormValid);

        if (isFormValid) {
            if (isEditMode) {
                updateProduct(id, {
                    nombre: values.nombre.value,
                    precio: values.precio.value,
                    cantidad: values.cantidad.value,
                    descripcion: values.descripcion.value,
                    imagen: values.imagen.value,
                    categoria_id: 1 // TODO: get categoria_id from the dropdown
                });
            } else {
                createNewProduct({
                    nombre: values.nombre.value,
                    precio: values.precio.value,
                    cantidad: values.cantidad.value,
                    descripcion: values.descripcion.value,
                    imagen: values.imagen.value,
                    categoria_id: 1 // TODO: get categoria_id from the dropdown
                });
            }
        } else {
            setShowFormErrors(true);
        }
    }


    return {
        loading,
        handleOk,
        isModalOpen,
        isFormValid,
        handleChange,
        handleSubmit,
        values,
        showFormErrors,
        fechaCreacion,
        fechaModificacion
    };
};
