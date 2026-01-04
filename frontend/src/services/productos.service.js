const API_URL = `${import.meta.env.VITE_API_URL_BASE}/productos`;


export const getProductos = async () => {
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};


export const postProducto = async (productoData) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoData)
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};

