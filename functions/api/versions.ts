interface Env {
  YOUVERSION_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const res = await fetch('https://api.youversion.com/v1/bibles?language_ranges[]=en', {
    headers: { 'X-YVP-App-Key': env.YOUVERSION_TOKEN },
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
