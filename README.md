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

Create a local environment file for your YouVersion API token:

```bash
cp .dev.vars.example .dev.vars
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

## Deployment

This project is configured for Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`

In Cloudflare Pages, add `YOUVERSION_TOKEN` as an environment variable for both preview and production.

## License

MIT