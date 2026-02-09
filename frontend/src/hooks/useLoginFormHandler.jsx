import { useState } from 'react';
import crypto from 'crypto-js';

export function useLoginFormHandler({ onSuccess } = {}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateUsername = (u) => /^\S{5,20}$/.test(u.trim());
  const validatePassword = (p) => p.length >= 5 && p.length <= 20;

  const trimmedUsername = username.trim();
  const canSubmit =
    validateUsername(trimmedUsername) &&
    validatePassword(password) &&
    !loading;

  function hashStringMD5(input) {
    const hash = crypto.MD5(input);
    const hashHex = hash.toString();
    return hashHex;
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setServerError('');
    if (!canSubmit) return;
    setLoading(true);

    try {
      const passwordEncrypted = hashStringMD5(password);

      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          password: passwordEncrypted,

        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.message || 'Credenciales inválidas');
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
    } finally {
      setLoading(false);
    }
  };

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
  };
}
