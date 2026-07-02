interface Env {
  YOUVERSION_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const codeChallenge = url.searchParams.get('code_challenge');
  const redirectUri = url.searchParams.get('redirect_uri');
  const state = url.searchParams.get('state');
  const nonce = url.searchParams.get('nonce');

  if (!codeChallenge || !redirectUri || !state || !nonce) {
    return new Response(JSON.stringify({ error: 'Missing params' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const authUrl = new URL('https://api.youversion.com/auth/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', env.YOUVERSION_TOKEN);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);

  return new Response(JSON.stringify({ url: authUrl.toString() }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
