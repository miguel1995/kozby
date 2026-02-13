import crypto from 'crypto-js';
const API_URL = import.meta.env.VITE_API_URL_BASE;

function hashStringMD5(input) {
  const hash = crypto.MD5(input);
  return hash.toString();
}

export async function login({ username, password }) {
  const passwordEncrypted = hashStringMD5(password);

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password: passwordEncrypted,
    }),
  });

  return res;
}
