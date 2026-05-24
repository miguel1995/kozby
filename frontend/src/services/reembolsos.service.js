const API_URL = `${import.meta.env.VITE_API_URL_BASE}/transaccion`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const getReembolsosPorTransaccion = async (transaccionId) => {
  const res = await fetch(`${API_URL}/${transaccionId}/reembolsos`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    let msg = 'No se pudo obtener los reembolsos';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch (_) {}
    throw new Error(msg);
  }
  return await res.json();
};
