import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { checkToken } from '../utils/authUtils';
import { getProductoById } from '../services/productos.service';

export const usePaymentProcess = () => {

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


    useEffect(() => {
        if (id) {
            fetchProducto(id);
        }
    }, [id]);

    const fetchProducto = async (id) => {
        setLoading(true);
        try {
            checkToken();
            const data = await getProductoById(id);


            const variantes = data.variantes.map(variante => ({
                id: { value: variante.id, valid: true },
                nombre: { value: variante.nombre, valid: true },
                precio: { value: variante.precio, valid: true },
                cantidad: { value: variante.cantidad, valid: true }
            }));
            
               
                setProduct({
                    id: data.id,
                    nombre: data.nombre,
                    precio: data.precio,
                    cantidad: data.cantidad,
                    descripcion: data.descripcion,
                    imagen: data.imagen,
                    variantes: variantes
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

    return {
        product,
        errorData,
        loading
    }
}
   