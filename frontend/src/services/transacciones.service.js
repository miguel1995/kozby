const API_URL = import.meta.env.VITE_API_URL_BASE + '/transaccion';

const getAuthHeaders = () => ({
    authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getTransacciones = async () => {
    const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
        throw { status: res.status };
    }

     return await res.json();
};

export const postTransaccion = async (transaccion) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transaccion),
    });
    
    if (!res.ok) {
        throw { status: res.status };
    }
    return await res.json();
};