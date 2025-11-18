# Vercel Deployment Guide for KudiManager

## Backend Architecture

The backend has been restructured to support Vercel serverless deployment while maintaining local development compatibility.

### Directory Structure

```
├── api/                    # Vercel serverless API
│   ├── app.ts             # Express app with middleware & routes
│   ├── [...path].ts       # Catch-all serverless function, exports app
│   ├── routes.ts          # API route handlers (NO /api prefix)
│   ├── storage.ts         # Storage interface
│   └── subscription-utils.ts
├── server/                # Development server only
│   ├── index.ts           # Dev server with Vite
│   ├── api-wrapper.ts     # Mounts API at /api for dev
│   └── vite.ts            # Vite middleware
└── vercel.json            # Vercel configuration
```

### How It Works

#### Development Mode
1. `npm run dev` starts `server/index.ts`
2. Creates Express app and mounts API routes at `/api` prefix via `api-wrapper.ts`
3. Adds Vite middleware for HMR
4. Routes like `/api/login`, `/api/products` work correctly

#### Production (Vercel)
1. Vercel detects `api/[...path].ts` as a catch-all serverless function
2. The `vercel.json` rewrite routes all `/api/*` requests to this function:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api" }
     ]
   }
   ```
3. Vercel invokes the catch-all function for ANY `/api/*` request
4. Express app receives the full request and handles routing internally
5. Routes defined as `/login`, `/products` (no prefix) in `api/routes.ts`
6. Example: Request to `/api/login` → Vercel calls `api/[...path].ts` → Express matches `/login` route

### Frontend API Configuration

The frontend uses `VITE_API_URL` environment variable:

- **Development**: `VITE_API_URL=""` (empty) → API calls go to same origin `/api/*`
- **Production**: `VITE_API_URL="https://kudimanager.com/api"` → API calls go to production backend

The `getFullUrl()` function in `client/src/lib/queryClient.ts` properly concatenates:
- Removes trailing slash from base URL
- Ensures leading slash on path
- Returns: `https://kudimanager.com/api/login`, `https://kudimanager.com/api/products`

### Key Differences from Traditional Express

| Aspect | Traditional | Vercel Serverless |
|--------|------------|-------------------|
| Server creation | `app.listen(port)` | `export default app` |
| Route prefix | Can include `/api` | Routes without prefix, Vercel adds it |
| File structure | Single `server/` folder | Split `api/` (production) + `server/` (dev) |
| File naming | `index.ts` | `[...path].ts` (catch-all pattern) |
| Deployment | VPS/PaaS | Serverless function |

### Environment Variables Required

**Development:**
- `VITE_API_URL=""` (empty, use relative paths)
- `VITE_FIREBASE_*` (Firebase config)
- `SESSION_SECRET`

**Production (Vercel):**
- `VITE_API_URL="https://kudimanager.com/api"`
- `VITE_FIREBASE_*` (Firebase config)
- `SESSION_SECRET`
- `JWT_SECRET` (optional, has default)

### Deployment Steps

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Set environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### Testing Locally with Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Run Vercel dev server (simulates production)
vercel dev

# Normal development server
npm run dev
```

### Important Notes

1. **Do NOT include `/api` prefix in route definitions** in `api/routes.ts`
2. **Do NOT call `app.listen()`** in `api/app.ts` or `api/index.ts`
3. **Routes are automatically prefixed** by Vercel routing
4. **Development server adds prefix** via `api-wrapper.ts`
5. **Frontend URL construction** handles both dev and prod correctly

### Troubleshooting

**Problem**: 404 on API endpoints in production
- **Solution**: Verify `vercel.json` has correct rewrite rule
- **Solution**: Ensure routes don't have `/api` prefix

**Problem**: Double `/api/api` in URLs
- **Solution**: Remove prefix from route definitions in `api/routes.ts`
- **Solution**: Check `VITE_API_URL` doesn't end with trailing slash

**Problem**: API works in dev but not production
- **Solution**: Run `vercel dev` to test Vercel-specific routing
- **Solution**: Check environment variables are set in Vercel dashboard
