const API_URL = `${import.meta.env.VITE_API_URL_BASE}/productos`;

export const getProductosArchivados = async () => {
    const res = await fetch(`${API_URL}/archived`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
};

export const restaurarProducto = async (id) => {
    const res = await fetch(`${API_URL}/${id}/restore`, {
        method: 'PATCH',
    });
    if (!res.ok) throw new Error('Error al restaurar');
};


export const getProductos = async () => {
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};

export const getProductoById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
};


export const postProducto = async (productoData) => {
    const formData = new FormData();

    // Agregar todos los campos de texto
    Object.keys(productoData).forEach(key => {
        if (key === 'imagen') {
            // Si imagen es un File, agregarlo como archivo
            if (productoData[key] instanceof File) {
                formData.append('imagen', productoData[key]);
            } else if (productoData[key]) {
                // Si es una URL (string), agregarlo como texto
                formData.append('imagen', productoData[key]);
            }
        } else if (key === 'variantes') {
            const variantes = productoData[key].map(variante => {
                console.log("variante in post", variante);
                return {
                    id: variante.id,
                    nombre: variante.nombre,
                    precio: variante.precio,
                    cantidad: variante.cantidad,
                }
            });
            formData.append('variantes', JSON.stringify(variantes));
        } else {
            formData.append(key, productoData[key]);
        }
    });

    const res = await fetch(API_URL, {
        method: 'POST',
        body: formData // No establecer Content-Type, el navegador lo hace automáticamente
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};

export const putProducto = async (id, productoData) => {
    const formData = new FormData();

    // Agregar todos los campos de texto
    Object.keys(productoData).forEach(key => {
        if (key === 'imagen') {
            // Si imagen es un File, agregarlo como archivo
            if (productoData[key] instanceof File) {
                formData.append('imagen', productoData[key]);
            } else if (productoData[key]) {
                // Si es una URL (string), agregarlo como texto
                formData.append('imagen', productoData[key]);
            }
        } else if (key === 'variantes') {
            const variantes = productoData[key].map(variante => {
                return {
                    id: variante.id,
                    nombre: variante.nombre,
                    precio: variante.precio,
                    cantidad: variante.cantidad,
                }
            });
            formData.append('variantes', JSON.stringify(variantes));
        } else {
            formData.append(key, productoData[key]);
        }
    });

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: formData // No establecer Content-Type, el navegador lo hace automáticamente
    });

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

export const deleteProducto = async (id, imageId) => {
    const res = await fetch(`${API_URL}/${id}?imageId=${imageId}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
};