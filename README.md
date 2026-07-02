# Cursive Verses v2

Free printable Bible verse handwriting worksheets for cursive practice, Scripture memorization, and devotional use.

## What it does

- Loads Bible passages and a Verse of the Day
- Generates printable cursive worksheets in tracing or copywork mode
- Exports clean PDF worksheets for printing
- Runs as a React + Vite app with Cloudflare Pages Functions for API access

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Cloudflare Pages Functions
- jsPDF

## Local development

Install dependencies:

```bash
npm install
```

Create local environment files:

```bash
cp .dev.vars.example .dev.vars
cp .env.example .env
```

Start the app:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview with Cloudflare Pages locally:

```bash
npm run preview
```

## Project structure

- `src/`: React app, pages, components, hooks, and worksheet rendering logic
- `functions/`: Cloudflare Pages Functions API endpoints
- `public/`: static assets such as fonts and favicon

## Environment variables

- `YOUVERSION_TOKEN`: API token used by the Cloudflare functions to fetch Bible data
- `TURNSTILE_SECRET_KEY`: Turnstile secret key used by `functions/api/contact.ts` to verify captcha
- `RESEND_API_KEY`: API key for sending contact-form emails via Resend
- `CONTACT_TO_EMAIL`: Inbox where contact-form messages should be sent
- `CONTACT_FROM_EMAIL`: Verified sender identity for outgoing contact email
- `VITE_TURNSTILE_SITE_KEY`: Public Turnstile site key used by the frontend widget

## Deployment

This project is configured for Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`

In Cloudflare Pages, add these environment variables for both preview and production:

- `YOUVERSION_TOKEN`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Also add this build variable so Vite can render the captcha widget in the client:

- `VITE_TURNSTILE_SITE_KEY`

## License

MIT
