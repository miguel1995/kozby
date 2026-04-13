const API_URL = import.meta.env.VITE_API_URL_BASE + '/transaccion';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getTransacciones = async ({ limit = 10, createdAt = null, lastId = null } = {}) => {
  const url = new URL(API_URL);

  url.searchParams.set('limit', String(limit));
  if (createdAt) url.searchParams.set('createdAt', String(createdAt));
  if (lastId) url.searchParams.set('lastId', String(lastId));

  const res = await fetch(url.toString(), { headers: getAuthHeaders() });
  if (!res.ok) throw { status: res.status };
  return await res.json();
};


export const getTransaccionById = async (id) => {
    const url = new URL(API_URL);
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw { status: res.status };
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

export const postEnviarCorreoTransaccion = async (id, { to }) => {
    const res = await fetch(`${API_URL}/${id}/enviar-correo`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to }),
    });
    if (!res.ok) {
        let message = 'No se pudo enviar el correo';
        try {
            const data = await res.json();
            if (data && data.message) message = data.message;
        } catch (_) { /* ignore */ }
        throw { status: res.status, message };
    }
    return await res.json();
};