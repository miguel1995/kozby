const API_URL = `${import.meta.env.VITE_API_URL_BASE}/transaccion`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const postReembolso = async (transaccionId, { tipo, articulosDevueltos, montoDevuelto }) => {
  const res = await fetch(`${API_URL}/${transaccionId}/reembolso`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ tipo, articulosDevueltos, montoDevuelto }),
  });
  if (!res.ok) {
    let msg = 'No se pudo procesar el reembolso';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch (_) {}
    throw new Error(msg);
  }
  return await res.json();
};