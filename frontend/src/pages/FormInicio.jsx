import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { useLoginFormHandler } from '../hooks/useLoginFormHandler';

export default function FormInicio() {
  const navigate = useNavigate();
  const {
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
  } = useLoginFormHandler({ onSuccess: () => navigate('/productos') });

  return (
     <div style={{ maxWidth: 500, margin: '16rem auto 2rem auto', padding: 16 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 30, letterSpacing: 1 }}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} noValidate>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Usuario</label>

          <Input
            id="username"
            name="username"
            size="large"
            placeholder="Usuario"
            prefix={<UserOutlined />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            autoComplete="username"
            disabled={loading}
            status={
              !validateUsername(trimmedUsername) && username.length > 0
                ? 'error'
                : ''
            }
            style={{ marginTop: 6, width: '100%' }}
          />

          {!validateUsername(trimmedUsername) && username.length > 0 && (
            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              El usuario debe tener entre 5 y 20 caracteres y no contener espacios.
            </div>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Contraseña</label>

          <Input.Password
            id="password"
            name="password"
            size="large"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
            autoComplete="current-password"
            disabled={loading}
            status={
              !validatePassword(password) && password.length > 0
                ? 'error'
                : ''
            }
            style={{ marginTop: 6, width: '100%' }}
          />

          {!validatePassword(password) && password.length > 0 && (
            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              La contraseña debe tener entre 5 y 20 caracteres.
            </div>
          )}
        </div>

        {serverError && (
          <div
            role="alert"
            aria-live="polite"
            style={{ color: 'red', marginBottom: 12 }}
          >
            {serverError}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <SubmitButton
            text={loading ? 'Cargando...' : 'Iniciar sesión'}
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ width: '120%' }}
          />
        </div>
      </form>
    </div>
  );
}
