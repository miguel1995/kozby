import React, { useState, useEffect } from 'react';
import { postProducto, getProductoById, putProducto } from '../services/productos.service';
import { initialFormValues, VARIANTES_ACTIONS } from '../utils/constants';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import {
    archiveProducto,
    deleteProducto,
    restaurarProducto
} from '../services/productos.service';
import { message } from 'antd';

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
        open: false,
        nombre: '',
    });
    const [isArchived, setIsArchived] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("id", id);
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
        setIsFormValid(Object.values(values).every(field => {
            if (field.required === true) {
                return field.valid === true;
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

            console.log("data", data);
            const variantes = data.variantes.map(variante => ({
                id: { value: variante.id, valid: true },
                nombre: { value: variante.nombre, valid: true },
                precio: { value: variante.precio, valid: true },
                cantidad: { value: variante.cantidad, valid: true }
            }));
            setValues({
                nombre: { value: data.nombre, valid: true },
                precio: { value: data.precio, valid: true },
                cantidad: { value: data.cantidad, valid: true },
                descripcion: { value: data.descripcion, valid: true },
                imagen: { value: data.imagen, valid: true },
                variantes: { value: variantes, valid: true }
            });

            setFechaCreacion(data.createdAt);
            setFechaModificacion(data.updatedAt);
            setIsArchived(data.archivado);
        } catch (err) {
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };


    const createNewProduct = async (productoData) => {
        setLoading(true);
        try {
            console.log("productoData", productoData);
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
        setShowFormErrors(false);

        // Manejar tanto inputs normales como File objects
        const fieldName = e.target?.name;
        if (!fieldName) {
            console.warn("El evento de cambio no tiene un nombre de campo válido.");
            return;
        }
        let fieldValue;
        let isValid;
        let error;

        if (fieldName === "variantes") {
            if (e.target.action === VARIANTES_ACTIONS.CREATE) {
                setValues({
                    ...values,
                    [fieldName]: {
                        value: [...values.variantes.value, e.target.value],
                        valid: e.target.valid
                    }
                });
            }
            else if (e.target.action === VARIANTES_ACTIONS.UPDATE) {
                const updatedVariantes = values.variantes.value.map(variante => {
                    if (variante.id === e.target.value.id) {
                        return e.target.value;
                    }
                    return variante;
                });
                setValues({
                    ...values,
                    [fieldName]: {
                        value: updatedVariantes,
                        valid: e.target.valid
                    }
                });
            }
            else if (e.target.action === VARIANTES_ACTIONS.DELETE) {
                const updatedVariantes = values.variantes.value.filter(variante => variante.id.value !== e.target.value);
                setValues({
                    ...values,
                    [fieldName]: {
                        value: updatedVariantes,
                        valid: true
                    }
                });
            }
        } else {
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
    }

    const handleSubmit = () => {
        if (isFormValid) {
            // Transformar variantes del formato frontend al formato backend
            const variantesFormatted = values.variantes.value.map(variante => ({
                id: variante.id.value,
                nombre: variante.nombre.value,
                precio: variante.precio.value,
                cantidad: variante.cantidad.value
            }));

            console.log("variantesFormatted", variantesFormatted);

            if (isEditMode) {
                updateProduct(id, {
                    nombre: values.nombre.value,
                    precio: values.precio.value,
                    cantidad: values.cantidad.value,
                    descripcion: values.descripcion.value,
                    imagen: values.imagen.value,
                    variantes: variantesFormatted,
                    categoria_id: 1 // TODO: get categoria_id from the dropdown
                });
            } else {
                createNewProduct({
                    nombre: values.nombre.value,
                    precio: values.precio.value,
                    cantidad: values.cantidad.value,
                    descripcion: values.descripcion.value,
                    imagen: values.imagen.value,
                    variantes: variantesFormatted,
                    categoria_id: 1 // TODO: get categoria_id from the dropdown
                });
            }
        } else {
            setShowFormErrors(true);
        }
    }


    const hacerClick = async (key, record) => {

        if (key === 'archive') {
            setLoading(true);
            try {
                await archiveProducto(id);
                message.success('Artículo archivado');
                navigate('/productos');
                return;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (key === 'restore') {
            setLoading(true);
            try {
                console.log("restaurarProducto", id);
                await restaurarProducto(id);
                message.success('Producto restaurado');
                navigate( '/productos/archivados');
                return;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (key === 'delete') {
            setIsDeleteModalOpen({
                open: true,
                nombre: record.nombre,
            });
            return;
        }
    };


    const handleDeletePermanent = async () => {

        setLoading(true);
        try {
            let imageForDelete = values.imagen.value || '';

            if (imageForDelete !== '') {
                const fullFileName = values.imagen.value.split('/').pop(); // "o8vyvxdh2zhwsl8gmlyo.png"
                imageForDelete = "kozby/products/" + fullFileName.split('.')[0];     // "o8vyvxdh2zhwsl8gmlyo"
            }

            await deleteProducto(id, imageForDelete);
            message.success('Producto eliminado definitivamente');
            setIsDeleteModalOpen({
                open: false,
                nombre: '',
            });
            navigate((isArchived) ? '/productos/archivados' : '/productos');
        } catch (err) {
            console.log("error", err);
            message.error('Error al eliminar');
            setError(err.message);

        } finally {
            setLoading(false);
        }
    };


    const handleCancelDelete = () => {
        setIsDeleteModalOpen({
            open: false,
            nombre: '',
        });
    };

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
        fechaModificacion,
        hacerClick,
        handleDeletePermanent,
        isDeleteModalOpen,
        handleCancelDelete,
        isArchived
    };
};
