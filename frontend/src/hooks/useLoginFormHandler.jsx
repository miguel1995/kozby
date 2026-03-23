import { useState, useEffect } from 'react';
import { login } from '../services/authentication.service';
import { useNavigate } from 'react-router';

export function useLoginFormHandler({ onSuccess } = {}) {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/proceso-pagos');
    }
  }, []);

  const validateUsername = (u) => /^\S{5,20}$/.test(u.trim());
  const validatePassword = (p) => p.length >= 5 && p.length <= 20;

  const trimmedUsername = username.trim();
  const canSubmit =
    validateUsername(trimmedUsername) &&
    validatePassword(password) &&
    !loading;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setServerError('');
    setIsErrorModalOpen(false);
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await login({
        username: trimmedUsername,
        password,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        if (res.status >= 500) {
          setServerError(body.message || 'Error interno del servidor');
          setIsErrorModalOpen(true);
        } else {
          setServerError(body.message || 'Credenciales inválidas');
        }

        setLoading(false);

        return;
      }


      const data = await res.json().catch(() => ({}));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError('Error de conexión. Intenta de nuevo.');
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeErrorModal = () => setIsErrorModalOpen(false);

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    serverError,
    validateUsername,
    validatePassword,
    trimmedUsername,
    canSubmit,
    handleSubmit,
    setServerError,
    isErrorModalOpen,
    closeErrorModal,
  };
}
