const API_URL = import.meta.env.VITE_API_URL_BASE + '/usuarios';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getUsuarios = async () => {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw { status: res.status };
    return await res.json();
}

export const getUsuarioById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw { status: res.status };
    return await res.json();
}

export const postUsuario = async (data) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders() ,
        body: JSON.stringify(data) },
    );
    if (!res.ok) throw { status: res.status };
    return await res.json();
}


export const putUsuario = async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders() ,
        body: JSON.stringify(data) },
    );
    if (!res.ok) throw { status: res.status };
    return await res.json();
}

export const deleteUsuario = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() },
    );
    if (!res.ok) throw { status: res.status };
    return await res.json();
}