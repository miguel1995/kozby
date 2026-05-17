const API_URL = import.meta.env.VITE_API_URL_BASE + '/transaccion';

// Buscar transacción por número de recibo
export const getTransaccionByRecibo = async (recibo) => {
    if (!recibo) throw new Error('Debe proporcionar el número de recibo');
    const url = new URL(API_URL + `/recibo/${recibo}`);
    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    if (!res.ok) throw { status: res.status };
    return await res.json();
};

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

const parseReciboPngError = async (res) => {
  let msg = 'No se pudo obtener el recibo';
  try {
    const data = await res.json();
    if (data?.message) msg = data.message;
  } catch (_) {
    /* respuesta no JSON */
  }
  return msg;
};

export const fetchReciboPngWithMeta = async (id) => {
  const res = await fetch(`${API_URL}/${id}/recibo.png`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(await parseReciboPngError(res));
  }
  const cd = res.headers.get('Content-Disposition');
  let filename = `recibo-${id}.png`;
  if (cd) {
    const match = /filename="([^"]+)"/.exec(cd) || /filename=([^;]+)/.exec(cd);
    if (match) filename = match[1].trim();
  }
  const blob = await res.blob();
  return { blob, filename };
};

export const fetchReciboPngBlob = async (id) => {
  const { blob } = await fetchReciboPngWithMeta(id);
  return blob;
};

export const downloadReciboPng = async (id) => {
  const { blob, filename } = await fetchReciboPngWithMeta(id);
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
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