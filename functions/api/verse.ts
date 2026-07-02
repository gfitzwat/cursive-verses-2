interface Env {
  YOUVERSION_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const usfm = url.searchParams.get('usfm');
  const bibleId = url.searchParams.get('bible_id') ?? '1';

  if (!usfm) {
    return new Response(JSON.stringify({ error: 'Missing usfm param' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch(
    `https://api.youversion.com/v1/bibles/${bibleId}/passages/${encodeURIComponent(usfm)}`,
    { headers: { 'X-YVP-App-Key': env.YOUVERSION_TOKEN } },
  );
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status, headers: { 'Content-Type': 'application/json' },
  });
};
