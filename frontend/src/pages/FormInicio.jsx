import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FormInicio() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validateUsername = (u) => /^\S{5,20}$/.test(u.trim());
  const validatePassword = (p) => p.length >= 5 && p.length <= 20;

  const trimmedUsername = username.trim();
  const canSubmit = validateUsername(trimmedUsername) && validatePassword(password) && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password }),
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

      navigate('/productos');
    } catch (err) {
      setServerError('Error de conexión. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto', padding: 16 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={5}
            maxLength={20}
            pattern="\\S{5,20}"
            autoComplete="username"
            required
            disabled={loading}
            aria-invalid={!validateUsername(trimmedUsername)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
          />
          {!validateUsername(trimmedUsername) && username.length > 0 && (
            <div style={{ color: 'red', fontSize: 12 }}>
              El usuario debe tener entre 5 y 20 caracteres y no contener espacios.
            </div>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={5}
            maxLength={20}
            autoComplete="current-password"
            required
            disabled={loading}
            aria-invalid={!validatePassword(password)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
          />
          {!validatePassword(password) && password.length > 0 && (
            <div style={{ color: 'red', fontSize: 12 }}>
              La contraseña debe tener entre 5 y 20 caracteres.
            </div>
          )}
        </div>

        {serverError && (
          <div role="alert" aria-live="polite" style={{ color: 'red', marginBottom: 12 }}>{serverError}</div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          style={{ padding: '8px 16px' }}
        >
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}