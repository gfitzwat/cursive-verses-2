import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'

function loadDevVars(): Record<string, string> {
  try {
    return Object.fromEntries(
      fs.readFileSync('.dev.vars', 'utf-8')
        .split('\n')
        .filter(l => l.includes('='))
        .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
    )
  } catch { return {} }
}

const YV_BASE = 'https://api.youversion.com'

function dayOfYear(): number {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-proxy',
      configureServer(server) {
        const token = loadDevVars()['YOUVERSION_TOKEN'] ?? ''
        const headers = { 'X-YVP-App-Key': token }

        server.middlewares.use('/api', async (req: IncomingMessage, res: ServerResponse) => {
          const url = new URL(req.url ?? '/', 'http://localhost')
          const qs = url.searchParams
          const path = url.pathname.replace(/^\//, '')

          const json = (data: unknown, status = 200) => {
            res.writeHead(status, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(data))
          }

          // Forward user Authorization token if present
          const userAuth = (req.headers['authorization'] as string | undefined) ?? ''
          const reqHeaders: Record<string, string> = { ...headers }
          if (userAuth) reqHeaders['Authorization'] = userAuth

          // Read request body for POST requests
          const readBody = (): Promise<string> => new Promise(resolve => {
            let body = ''
            req.on('data', (chunk: Buffer) => { body += chunk.toString() })
            req.on('end', () => resolve(body))
          })

          try {
            if (path === 'versions') {
              const r = await fetch(`${YV_BASE}/v1/bibles?language_ranges[]=en`, { headers: reqHeaders })
              return json(await r.json())
            }

            if (path === 'verse') {
              const usfm = qs.get('usfm')
              const bibleId = qs.get('bible_id') ?? '1'
              if (!usfm) return json({ error: 'Missing usfm' }, 400)
              const r = await fetch(
                `${YV_BASE}/v1/bibles/${bibleId}/passages/${encodeURIComponent(usfm)}`,
                { headers: reqHeaders },
              )
              return json(await r.json(), r.status)
            }

            if (path === 'verse-of-day') {
              const bibleId = qs.get('bible_id') ?? '1'
              const votdRes = await fetch(`${YV_BASE}/v1/verse_of_the_days/${dayOfYear()}`, { headers: reqHeaders })
              const votd = await votdRes.json() as { passage_id?: string }
              if (!votd.passage_id) return json({ error: 'No passage_id' }, 502)
              const textRes = await fetch(
                `${YV_BASE}/v1/bibles/${bibleId}/passages/${encodeURIComponent(votd.passage_id)}`,
                { headers: reqHeaders },
              )
              const text = await textRes.json()
              return json({ ...(text as object), passage_id: votd.passage_id })
            }

            if (path === 'auth/authorize-url') {
              const codeChallenge = qs.get('code_challenge')
              const redirectUri = qs.get('redirect_uri')
              const state = qs.get('state')
              const nonce = qs.get('nonce')
              if (!codeChallenge || !redirectUri || !state || !nonce) return json({ error: 'Missing params' }, 400)
              const authUrl = new URL(`${YV_BASE}/auth/authorize`)
              authUrl.searchParams.set('response_type', 'code')
              authUrl.searchParams.set('client_id', token)
              authUrl.searchParams.set('redirect_uri', redirectUri)
              authUrl.searchParams.set('scope', 'openid profile email')
              authUrl.searchParams.set('code_challenge', codeChallenge)
              authUrl.searchParams.set('code_challenge_method', 'S256')
              authUrl.searchParams.set('state', state)
              authUrl.searchParams.set('nonce', nonce)
              return json({ url: authUrl.toString() })
            }

            if (path === 'auth/callback' && req.method === 'POST') {
              const body = await readBody()
              const { code, code_verifier, redirect_uri } = JSON.parse(body) as {
                code?: string; code_verifier?: string; redirect_uri?: string
              }
              if (!code || !code_verifier || !redirect_uri) return json({ error: 'Missing params' }, 400)
              const formBody = new URLSearchParams({
                grant_type: 'authorization_code',
                code, code_verifier, redirect_uri, client_id: token,
              })
              const r = await fetch(`${YV_BASE}/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-YVP-App-Key': token },
                body: formBody.toString(),
              })
              return json(await r.json(), r.status)
            }

            json({ error: 'Not found' }, 404)
          } catch (e) {
            json({ error: String(e) }, 502)
          }
        })
      },
    },
  ],
})
