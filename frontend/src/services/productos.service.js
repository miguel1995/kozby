const API_URL = `${import.meta.env.VITE_API_URL_BASE}/productos`;


export const getProductos = async () => {
    console.log('Mensaje de prueba', API_URL);
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};
