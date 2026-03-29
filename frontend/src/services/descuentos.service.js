const API_URL = `${import.meta.env.VITE_API_URL_BASE}/descuentos`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getDescuentos = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw { status: res.status };
  return await res.json();
};
