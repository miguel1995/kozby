import React, { useState, useEffect } from 'react';
import { checkToken } from '../utils/authUtils';
import {getTransacciones}from '../services/transacciones.service';


export const useTransaccionHandler = () => {
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorData, setErrorData] = useState({
        codeError: null,
        isOpen: false
    });

    const handleOk = () => {
        setErrorData({
            codeError: null,
            isOpen: false
        });
    }

    const fetchTransacciones = async () => {
        setLoading(true);
        try {
            checkToken();
            const data = await getTransacciones();
            setTransacciones(data);
        } catch (err){
            setErrorData({
                codeError: err.status || 500,
                isOpen: true
            });
            setTransacciones([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransacciones();
    }, []);

    return {
        transacciones,
        loading,
        errorData,
        handleOk
    };
}



