interface Env {
  YOUVERSION_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const bibleId = new URL(request.url).searchParams.get('bible_id') ?? '1';
  const headers = { 'X-YVP-App-Key': env.YOUVERSION_TOKEN };
  const base = 'https://api.youversion.com';

  const now = new Date();
  const day = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  const votdRes = await fetch(`${base}/v1/verse_of_the_days/${day}`, { headers });
  if (!votdRes.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch VOTD' }), {
      status: votdRes.status, headers: { 'Content-Type': 'application/json' },
    });
  }
  const votd = await votdRes.json() as { passage_id?: string };
  if (!votd.passage_id) {
    return new Response(JSON.stringify({ error: 'No passage_id' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }

  const textRes = await fetch(
    `${base}/v1/bibles/${bibleId}/passages/${encodeURIComponent(votd.passage_id)}`,
    { headers },
  );
  const text = await textRes.json();
  return new Response(JSON.stringify({ ...(text as object), passage_id: votd.passage_id }), {
    status: textRes.status, headers: { 'Content-Type': 'application/json' },
  });
};
