import { useEffect, useState } from 'react';

interface Props {
  onSuccess: (code: string) => Promise<boolean>;
}

export default function CallbackHandler({ onSuccess }: Props) {
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnedState = params.get('state');
    const savedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');

    if (returnedState !== savedState) {
      setDetail(`State mismatch (got "${returnedState}", expected "${savedState}")`);
      setStatus('error');
      return;
    }

    // YouVersion returns user data directly (non-standard) — yvp_id is the user token
    const yvpId = params.get('yvp_id');
    const code = params.get('code') ?? yvpId ?? '';

    if (!code) {
      const yvError = params.get('error');
      const yvDesc = params.get('error_description');
      setDetail(yvError ? `YouVersion error: ${yvError} — ${yvDesc}` : `No token in callback URL. Full URL: ${window.location.href}`);
      setStatus('error');
      return;
    }

    onSuccess(code).then(ok => {
      if (ok) {
        window.history.replaceState({}, '', '/');
        window.location.reload();
      } else {
        setStatus('error');
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      {status === 'loading' ? (
        <p className="text-slate-500 text-sm">Signing in with YouVersion…</p>
      ) : (
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 text-sm mb-2">Sign-in failed. Please try again.</p>
          {detail && <p className="text-xs text-slate-400 mb-3 font-mono">{detail}</p>}
          <a href="/" className="text-indigo-600 text-sm underline">Go back</a>
        </div>
      )}
    </div>
  );
}
