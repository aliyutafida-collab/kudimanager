# Vercel Deployment Guide for KudiManager

## Quick Deploy (Fix Build Cache Issues)

If Vercel is building old/cached code, follow these steps:

### 1. Add Environment Variable to Disable Cache
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add: `VERCEL_FORCE_NO_BUILD_CACHE` = `1`
3. Apply to: **Production, Preview, Development**
4. Click **Save**

### 2. Manual Redeploy
1. Go to **Deployments** tab
2. Click latest deployment's **"···"** menu
3. Select **"Redeploy"**
4. **Turn OFF** "Use existing Build Cache"
5. Click **Redeploy**

### 3. Verify Deployment
- Check that the commit hash matches your latest git commit
- Test the deployed app to ensure it's using the new code

---

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
├── client/                # Frontend React app
│   └── dist/              # Build output (after npm run build)
└── vercel.json            # Vercel configuration
```

### Vercel Configuration

The `vercel.json` file is configured to:
1. Build the frontend with `npm run build` (outputs to `client/dist`)
2. Serve static files from `client/dist`
3. Route API calls to serverless functions in `api/`

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": "client/dist",
  "framework": null,
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### How It Works

#### Development Mode
1. `npm run dev` starts `server/index.ts`
2. Creates Express app and mounts API routes at `/api` prefix via `api-wrapper.ts`
3. Adds Vite middleware for HMR
4. Routes like `/api/login`, `/api/products` work correctly

#### Production (Vercel)
1. Vercel builds frontend to `client/dist` using `npm run build`
2. Vercel serves static files from `client/dist`
3. Vercel detects `api/[...path].ts` as a catch-all serverless function
4. API requests to `/api/*` are routed to the serverless function
5. Express app receives the full request and handles routing internally
6. Routes defined as `/login`, `/products` (no prefix) in `api/routes.ts`
7. Example: Request to `/api/login` → Vercel calls `api/[...path].ts` → Express matches `/login` route

### Frontend API Configuration

The frontend uses `VITE_API_URL` environment variable:

- **Development**: `VITE_API_URL=""` (empty) → API calls go to same origin `/api/*`
- **Production**: `VITE_API_URL=""` (empty) → API calls go to same origin `/api/*`

The `getFullUrl()` function in `client/src/lib/queryClient.ts` properly concatenates:
- Removes trailing slash from base URL
- Ensures leading slash on path
- Returns: `/api/login`, `/api/products` (relative URLs)

### Key Differences from Traditional Express

| Aspect | Traditional | Vercel Serverless |
|--------|------------|-------------------|
| Server creation | `app.listen(port)` | `export default app` |
| Route prefix | Can include `/api` | Routes without prefix, Vercel adds it |
| File structure | Single `server/` folder | Split `api/` (production) + `server/` (dev) |
| File naming | `index.ts` | `[...path].ts` (catch-all pattern) |
| Deployment | VPS/PaaS | Serverless function |
| Static files | Served by Express | Served by Vercel CDN |

### Environment Variables Required

**Development:**
- `VITE_API_URL=""` (empty, use relative paths)
- `VITE_FIREBASE_*` (Firebase config)
- `SESSION_SECRET`

**Production (Vercel):**
- `VITE_API_URL=""` (empty, use relative paths)
- `VITE_FIREBASE_*` (Firebase config)
- `SESSION_SECRET`
- `JWT_SECRET` (optional, has default)
- `VERCEL_FORCE_NO_BUILD_CACHE="1"` (optional, disables build cache)

### Deployment Steps

#### First-Time Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Set environment variables in Vercel dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add all required variables (see above)
   - Apply to **Production, Preview, Development**

#### Deploy to Production
```bash
# Option 1: Using Vercel CLI
vercel --prod

# Option 2: Git Push (auto-deploy)
git push origin main
```

#### Clear Build Cache and Redeploy
```bash
# Set environment variable first (see Quick Deploy section above)
# Then redeploy from Vercel dashboard with cache disabled
```

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
2. **Do NOT call `app.listen()`** in `api/app.ts` or `api/[...path].ts`
3. **Routes are automatically prefixed** by Vercel routing
4. **Development server adds prefix** via `api-wrapper.ts`
5. **Frontend URL construction** uses relative paths (no absolute URLs needed)
6. **Static files** are served by Vercel CDN, not the Express app

### Troubleshooting

#### Problem: Vercel building old/cached code
**Symptoms:**
- Build fails with old code errors
- Deployed app doesn't reflect latest changes
- Error mentions files that don't exist anymore

**Solutions:**
1. Add `VERCEL_FORCE_NO_BUILD_CACHE=1` environment variable
2. Redeploy with "Use existing Build Cache" turned OFF
3. Hard refresh browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)
4. Check commit hash in Vercel dashboard matches latest git commit

#### Problem: 404 on API endpoints in production
**Solutions:**
- Verify `vercel.json` has correct rewrite rules
- Ensure routes don't have `/api` prefix in `api/routes.ts`
- Check environment variables are set correctly

#### Problem: Double `/api/api` in URLs
**Solutions:**
- Remove prefix from route definitions in `api/routes.ts`
- Check `VITE_API_URL` is empty or doesn't end with `/api`

#### Problem: API works in dev but not production
**Solutions:**
- Run `vercel dev` to test Vercel-specific routing
- Check environment variables are set in Vercel dashboard
- Verify serverless function logs in Vercel dashboard

#### Problem: CORS errors in production
**Solutions:**
- Add your Vercel domain to allowed origins in `api/app.ts`
- Check CORS configuration matches your deployment URL
- Ensure credentials are properly configured

---

## Build Process Details

### What `npm run build` does:
1. **Frontend Build**: `vite build` → Outputs to `client/dist/`
   - Bundles React app
   - Optimizes assets
   - Generates production HTML/CSS/JS

2. **Server Build**: `esbuild server/index.ts` → Outputs to `dist/index.js`
   - Bundles Express server (for local production testing)
   - NOT used by Vercel (Vercel uses `api/` folder)

### Vercel Deployment Process:
1. Runs `npm install` (all dependencies)
2. Runs `npm run build` (builds frontend + server)
3. Serves static files from `client/dist/`
4. Deploys `api/` folder as serverless functions
5. Routes requests according to `vercel.json`

---

## Performance Optimization

- Frontend served from Vercel CDN (edge network)
- API runs as serverless functions (auto-scaling)
- Static assets cached globally
- Build cache disabled if stale code issues occur
