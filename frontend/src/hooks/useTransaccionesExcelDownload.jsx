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
    setLoading(true);
    try {
      checkToken();

      let range;
      if (desdeYmd && hastaYmd) {
        range = {
          desdeISO: startOfLocalDay(desdeYmd).toISOString(),
          hastaISO: endOfLocalDay(hastaYmd).toISOString(),
        };
      } else if (desdeYmd || hastaYmd) {
        message.warning('Seleccione fecha inicial y fecha final, o deje ambas vacías para exportar todo.');
        return;
      }

      await downloadTransaccionesExcel(range);
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
