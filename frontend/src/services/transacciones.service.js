const API_URL = import.meta.env.VITE_API_URL_BASE + '/transaccion';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getTransacciones = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw { status: res.status };
  return await res.json();
};

export const getTransaccionById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw { status: res.status };
  return await res.json();
};
