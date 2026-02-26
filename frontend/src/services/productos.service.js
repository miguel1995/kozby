const API_URL = `${import.meta.env.VITE_API_URL_BASE}/productos`;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getProductosArchivados = async () => {
    const res = await fetch(`${API_URL}/archived`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw { status: res.status };
    return await res.json();
};

export const restaurarProducto = async (id) => {
    const res = await fetch(`${API_URL}/${id}/restore`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw { status: res.status };
};

export const getProductos = async () => {
    const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        throw { status: res.status };
    }

    return await res.json();
};

export const getProductoById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw { status: res.status };
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
                };
            });
            formData.append('variantes', JSON.stringify(variantes));
        } else {
            formData.append(key, productoData[key]);
        }
    });

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData // No establecer Content-Type, el navegador lo hace automáticamente
    });

    if (!res.ok) {
        throw { status: res.status };
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
                };
            });
            formData.append('variantes', JSON.stringify(variantes));
        } else {
            formData.append(key, productoData[key]);
        }
    });

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData // No establecer Content-Type, el navegador lo hace automáticamente
    });

    if (!res.ok) {
        throw { status: res.status };
    }

    return await res.json();
};

export const archiveProducto = async (id) => {
    const res = await fetch(`${API_URL}/${id}/archive`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        throw { status: res.status };
    }

    return await res.json();
};

export const deleteProducto = async (id, imageId) => {
    const res = await fetch(`${API_URL}/${id}?imageId=${imageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        throw { status: res.status };
    }

    return await res.json();
};
