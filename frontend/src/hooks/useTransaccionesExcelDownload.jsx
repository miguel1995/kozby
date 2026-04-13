import { useState, useCallback } from 'react';
import { message } from 'antd';
import { checkToken } from '../utils/authUtils';
import { downloadTransaccionesExcel } from '../services/transaccionesExcel.service';
import {
  startOfLocalDay,
  endOfLocalDay,
  presetUltimoDiaCalendario,
  presetUltimaSemana,
  presetUltimoMes,
} from '../utils/dateRangeExport';

export const useTransaccionesExcelDownload = () => {
  const [loading, setLoading] = useState(false);
  /** YYYY-MM-DD o '' */
  const [desdeYmd, setDesdeYmd] = useState('');
  const [hastaYmd, setHastaYmd] = useState('');

  const applyPresetUltimoDia = useCallback(() => {
    const p = presetUltimoDiaCalendario();
    setDesdeYmd(p.desde);
    setHastaYmd(p.hasta);
  }, []);

  const applyPresetSemana = useCallback(() => {
    const p = presetUltimaSemana();
    setDesdeYmd(p.desde);
    setHastaYmd(p.hasta);
  }, []);

  const applyPresetMes = useCallback(() => {
    const p = presetUltimoMes();
    setDesdeYmd(p.desde);
    setHastaYmd(p.hasta);
  }, []);

  const downloadExcel = useCallback(async () => {
    if (!desdeYmd || !hastaYmd) {
      message.warning('Seleccione un rango de fechas completo (desde y hasta).');
      return;
    }

    setLoading(true);
    try {
      checkToken();
      await downloadTransaccionesExcel({
        desdeISO: startOfLocalDay(desdeYmd).toISOString(),
        hastaISO: endOfLocalDay(hastaYmd).toISOString(),
      });
      message.success('Archivo descargado correctamente.');
    } catch (err) {
      const isUnauthorized = err?.status === 401;
      message.error(
        isUnauthorized
          ? 'Sesión no válida. Inicie sesión de nuevo.'
          : err?.message || 'Error al descargar el archivo.'
      );
    } finally {
      setLoading(false);
    }
  }, [desdeYmd, hastaYmd]);

  return {
    loading,
    desdeYmd,
    hastaYmd,
    setDesdeYmd,
    setHastaYmd,
    applyPresetUltimoDia,
    applyPresetSemana,
    applyPresetMes,
    downloadExcel,
  };
};
