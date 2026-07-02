interface Env {
  YOUVERSION_TOKEN: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const { code, code_verifier, redirect_uri } = await request.json() as {
    code?: string;
    code_verifier?: string;
    redirect_uri?: string;
  };

  if (!code || !code_verifier || !redirect_uri) {
    return new Response(JSON.stringify({ error: 'Missing params' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    code_verifier,
    redirect_uri,
    client_id: env.YOUVERSION_TOKEN,
  });

  const res = await fetch('https://api.youversion.com/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-YVP-App-Key': env.YOUVERSION_TOKEN,
    },
    body: body.toString(),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status, headers: { 'Content-Type': 'application/json' },
  });
};
