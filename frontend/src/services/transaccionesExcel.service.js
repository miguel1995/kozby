const EXPORT_BASE = `${import.meta.env.VITE_API_URL_BASE}/transaccion/export/excel`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

/**
 * @param {{ desdeISO?: string, hastaISO?: string }} [range] - Si se omite, exporta toda la colección.
 */
export const downloadTransaccionesExcel = async (range) => {
  const url = new URL(EXPORT_BASE);
  if (range?.desdeISO && range?.hastaISO) {
    url.searchParams.set('desde', range.desdeISO);
    url.searchParams.set('hasta', range.hastaISO);
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    let msg = 'No se pudo descargar el archivo';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch (_) {
      /* respuesta no JSON */
    }
    throw new Error(msg);
  }

  const blob = await res.blob();
  const cd = res.headers.get('Content-Disposition');
  let filename = `transacciones-${new Date().toISOString().slice(0, 10)}.xlsx`;
  if (cd) {
    const match = /filename="([^"]+)"/.exec(cd) || /filename=([^;]+)/.exec(cd);
    if (match) filename = match[1].trim();
  }

  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
};
