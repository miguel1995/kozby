/** Fecha local en YYYY-MM-DD */
export const toLocalYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Inicio del dia local (para ISO al backend) */
export const startOfLocalDay = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};

/** Fin del dia local */
export const endOfLocalDay = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
};

/** Ayer (calendario local), mismo dia desde/hasta */
export const presetUltimoDiaCalendario = () => {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const ymd = toLocalYMD(ayer);
  return { desde: ymd, hasta: ymd };
};

/** Hoy y los 6 dias anteriores (7 dias inclusive) */
export const presetUltimaSemana = () => {
  const hasta = new Date();
  const desde = new Date(hasta);
  desde.setDate(desde.getDate() - 6);
  return { desde: toLocalYMD(desde), hasta: toLocalYMD(hasta) };
};

/** Hoy y los 29 dias anteriores (30 dias inclusive) */
export const presetUltimoMes = () => {
  const hasta = new Date();
  const desde = new Date(hasta);
  desde.setDate(desde.getDate() - 29);
  return { desde: toLocalYMD(desde), hasta: toLocalYMD(hasta) };
};
