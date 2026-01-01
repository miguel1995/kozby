const API_URL = `${import.meta.env.VITE_API_URL_BASE}/productos`;

export const getProductosArchivados = async () => {
    const res = await fetch(`${API_URL}/archived`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
};

export const getProductos = async () => {
    console.log('Mensaje de prueba', API_URL);
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};

export const archiveProducto = async (id) => {
    const res = await fetch(`${API_URL}/${id}/archive`, {
        method: 'PATCH',
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};

export const deleteProducto = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};