interface Env {
  YOUVERSION_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
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

  return new Response(JSON.stringify({ passage_id: votd.passage_id }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
