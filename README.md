# Movie Reviews UI

A React + Vite frontend for a TMDB-powered movie reviews platform.

This repo is the UI only. It expects a separate Express backend that serves the
movie catalog from TMDB and stores auth plus reviews in MongoDB Atlas.

## Backend contract

The UI is wired for these endpoints:

- `GET /api/health`
- `GET /api/movies`
- `GET /api/movies?query=<search>&page=<page>`
- `GET /api/movies/:tmdbIdOrSlug`
- `GET /api/reviews/movie/:tmdbId`
- `POST /api/movies/:tmdbId/reviews`
- `POST /api/reviews`
- `GET /api/auth/me`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `DELETE /api/reviews/:id`

Movie catalog data is TMDB-backed. Auth and reviews are backend-managed.

## Local development

1. Copy `.env.example` to `.env`
2. Point `VITE_DEV_PROXY_TARGET` at your local backend
3. Run:

```bash
npm install
npm run dev
```

Default local URLs:

- Vite frontend on `http://localhost:5173`
- Backend expected on `http://localhost:5001`

During local development, the frontend proxies `/api` requests to
`VITE_DEV_PROXY_TARGET`.

`.env` is for local development only and is already ignored by
`.gitignore`, so it should not be committed to GitHub.

Only `VITE_*` variables are exposed to the browser in a Vite app. Do not put
backend secrets, API keys, JWT secrets, or database credentials in this
frontend project.

React Strict Mode is still enabled, so you may see duplicate API calls in
development. Production builds do not double-run those effects.

## Vercel deployment

For a single frontend deployment:

1. Deploy the backend separately.
2. Add `VITE_API_BASE_URL` in Vercel Project Settings -> Environment Variables.
3. Deploy this frontend to Vercel.

Example:

```env
VITE_API_BASE_URL=https://movie-reviews-inky.vercel.app/api
```

Do not add private backend secrets to this frontend Vercel project. The only
env value this UI needs in production is the public backend base URL.

After the UI is deployed, update the backend `CORS_ORIGIN` in Vercel to the
frontend's deployed URL and redeploy the backend.

## Scripts

- `npm run dev` starts the Vite frontend
- `npm run build` builds the Vite frontend
- `npm run preview` previews the frontend build
