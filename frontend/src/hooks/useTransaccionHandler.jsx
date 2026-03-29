import React, { useState, useEffect } from 'react';
import { checkToken } from '../utils/authUtils';
import { getTransacciones } from '../services/transacciones.service';
import { PAGE_SIZE } from '../utils/constants';


export const useTransaccionHandler = () => {

    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [next, setNext] = useState(null); 

    const [errorData, setErrorData] = useState({
        codeError: null,
        isOpen: false
    });

    const handleOk = () => {
        setErrorData({ codeError: null, isOpen: false });
    };

    const fetchFirstPage = async () => {
        setLoading(true);
        try {
            checkToken();
            const data = await getTransacciones({ limit: PAGE_SIZE });
            setTransacciones(data?.items || []);
            setHasMore(Boolean(data?.hasMore));
            setNext(data?.next || null);
        } catch (err) {
            setErrorData({ codeError: err.status || 500, isOpen: true });
            setTransacciones([]);
            setHasMore(false);
            setNext(null);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore || loading || !hasMore || !next) return;

        setLoadingMore(true);
        try {
            checkToken();
            const data = await getTransacciones({
                limit: PAGE_SIZE,
                createdAt: next.createdAt,
                lastId: next.lastId
            });

            const incoming = data?.items || [];
            setTransacciones((prev) => {
                const map = new Map(prev.map((t) => [t.id, t]));
                for (const item of incoming) map.set(item.id, item);
                return Array.from(map.values());
            });


            setHasMore(Boolean(data?.hasMore));
            setNext(data?.next || null);
        } catch (err) {
            setErrorData({ codeError: err.status || 500, isOpen: true });
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchFirstPage();
    }, []);

    return {
        transacciones,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        errorData,
        handleOk
    };
};
