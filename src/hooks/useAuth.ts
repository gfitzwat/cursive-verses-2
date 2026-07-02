import { useState, useEffect, useCallback } from 'react';

const TOKEN_KEY = 'yv_access_token';

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generatePkce(): Promise<{ verifier: string; challenge: string }> {
  const array = crypto.getRandomValues(new Uint8Array(32));
  const verifier = base64url(array.buffer);
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = base64url(hash);
  return { verifier, challenge };
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const startLogin = useCallback(async () => {
    const { verifier, challenge } = await generatePkce();
    const redirectUri = `${window.location.origin}/callback`;
    const state = base64url(crypto.getRandomValues(new Uint8Array(16)).buffer);
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)).buffer);
    sessionStorage.setItem('pkce_verifier', verifier);
    sessionStorage.setItem('pkce_redirect_uri', redirectUri);
    sessionStorage.setItem('oauth_state', state);

    const res = await fetch(
      `/api/auth/authorize-url?code_challenge=${challenge}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&nonce=${nonce}`
    );
    const { url } = await res.json() as { url: string };
    window.location.href = url;
  }, []);

  const handleCallback = useCallback(async (yvpIdOrCode: string): Promise<boolean> => {
    sessionStorage.removeItem('pkce_verifier');
    sessionStorage.removeItem('pkce_redirect_uri');
    setToken(yvpIdOrCode);
    return true;
  }, []);

  const logout = useCallback(() => setToken(null), []);

  return { token, startLogin, handleCallback, logout };
}
