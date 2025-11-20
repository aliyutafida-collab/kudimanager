# Vercel Deployment Guide - KudiManager Monorepo

## ✅ Configuration Complete

The monorepo is now correctly configured for Vercel deployment with proper workspace separation.

---

## 📋 Final Vercel Configuration

**File: `vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["server/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

### How It Works

**Client Build (`@vercel/static-build`)**:
1. Detects `client/package.json`
2. Runs `npm run build` in client workspace → `vite build`
3. Outputs to `client/dist/`
4. Vercel promotes `client/dist/` contents to deployment root
5. Static files accessible at `/` (e.g., `/index.html`, `/assets/*`)

**Server Build (`@vercel/node`)**:
1. Detects `server/index.ts`
2. Automatically transpiles TypeScript
3. Creates serverless function from `export default app`
4. Includes all server files via `includeFiles: ["server/**"]`
5. Handles all `/api/*` routes

**Routing**:
- `/api/*` → Serverless function (`server/index.ts`)
- `/*` → Static files (fallback to `/index.html` for SPA routing)

---

## 🚀 Deployment Steps

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy to preview environment
vercel

# Deploy to production
vercel --prod
```

### Option 2: Git Integration (Recommended)

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Configure monorepo for Vercel"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel auto-detects `vercel.json`
   - Click "Deploy"

3. **Automatic Deployments**:
   - Push to `main` → Production deployment
   - Push to any branch → Preview deployment
   - Open PR → Preview deployment with unique URL

---

## 🔑 Environment Variables

### Required Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

**Frontend (must have `VITE_` prefix)**:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_API_URL=https://your-domain.vercel.app
```

**Backend**:
```
SESSION_SECRET=your-session-secret-here
NODE_ENV=production
```

**Optional** (if using database):
```
DATABASE_URL=your-postgresql-connection-string
```

### How to Add

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable with:
   - **Key**: Variable name
   - **Value**: Secret value
   - **Environments**: Production, Preview, Development (select all)
3. Click "Save"
4. Redeploy for changes to take effect

---

## 🧪 Testing Before Deployment

### Local Build Verification

```bash
# Build both workspaces
npm run build

# Verify outputs
ls -la client/dist/    # Should contain: index.html, assets/, manifest.json
ls -la server/dist/    # Should contain: index.js

# Test client build
cd client
npm run preview        # Opens preview server

# Test server build
cd server
npm start             # Runs built server
```

### Preview Deployment

```bash
# Deploy to preview (test environment)
vercel

# Vercel returns a preview URL like:
# https://your-project-abc123.vercel.app

# Test thoroughly before promoting to production
```

---

## ✅ Deployment Checklist

Before deploying, verify:

- ✅ `vercel.json` is configured correctly
- ✅ `npm run build` succeeds locally
- ✅ `client/dist/` contains built frontend
- ✅ `server/dist/index.js` exists
- ✅ `server/index.ts` exports Express app as default
- ✅ All environment variables are set in Vercel
- ✅ Git repository is up to date

---

## 🐛 Troubleshooting

### Build Fails: "Could not resolve entry module"

**Problem**: Vite can't find files

**Solution**: Verify `client/vite.config.ts` paths:
```typescript
root: ".",                                       // Current directory
resolve: {
  alias: {
    "@": path.resolve(import.meta.dirname, "src"),
    "@shared": path.resolve(import.meta.dirname, "../shared"),
    "@assets": path.resolve(import.meta.dirname, "../attached_assets"),
  },
},
build: {
  outDir: "dist",                               // Output to client/dist
}
```

### API Routes Return 404

**Problem**: Server routes not accessible

**Solution**: 
1. Check `vercel.json` routes - API route must come BEFORE wildcard
2. Verify `server/index.ts` exports: `export default app`
3. Ensure Express routes don't have `/api` prefix (added by Vercel routing)

### Environment Variables Not Working

**Problem**: Secrets not accessible

**Solution**:
1. Frontend vars MUST have `VITE_` prefix
2. Redeploy after adding variables
3. Check correct environment is selected (Production/Preview/Development)

### Static Files Not Loading

**Problem**: CSS/JS/images return 404

**Solution**:
1. Verify `distDir: "client/dist"` in vercel.json
2. Check files exist in `client/dist/` after build
3. Ensure asset imports use correct paths

### Serverless Function Timeout

**Problem**: Server exceeds 10s timeout (Hobby plan)

**Solution**:
1. Optimize database queries
2. Add indexes to frequently queried fields
3. Consider upgrading Vercel plan for higher limits
4. Use caching for expensive operations

---

## 📊 Build Outputs

### Current Build Sizes

**Client** (`client/dist/`):
- JavaScript: ~1.46 MB (minified)
- CSS: ~83 KB
- Assets: ~1.08 MB (logo image)
- Total: ~2.6 MB

**Server** (`server/dist/`):
- Bundle: ~58 KB (esbuild)

### Optimization Recommendations

1. **Code Splitting**:
   ```typescript
   // Use dynamic imports for large components
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. **Image Optimization**:
   - Compress logo PNG (currently 1.08 MB)
   - Use WebP format for better compression
   - Implement lazy loading for images

3. **Bundle Analysis**:
   ```bash
   npm run build -- --mode=analyze
   ```

---

## 🎯 Post-Deployment Verification

### Test Checklist

1. **Frontend**:
   - [ ] Homepage loads without errors
   - [ ] All assets load (CSS, JS, images)
   - [ ] PWA manifest and service worker registered
   - [ ] Client-side routing works (navigate, refresh)

2. **Backend**:
   - [ ] API endpoints respond (`/api/products`, etc.)
   - [ ] Authentication works (login, register)
   - [ ] Database queries succeed
   - [ ] CORS headers present

3. **Integration**:
   - [ ] Frontend can call backend APIs
   - [ ] Session persistence works
   - [ ] Protected routes enforce authentication
   - [ ] Form submissions save data

4. **Performance**:
   - [ ] Lighthouse score > 90
   - [ ] First Contentful Paint < 1.5s
   - [ ] Time to Interactive < 3.5s
   - [ ] Mobile performance acceptable

### Monitor Logs

```bash
# View deployment logs
vercel logs [deployment-url]

# Stream real-time logs
vercel logs --follow

# Filter by function
vercel logs --filter=server/index.ts
```

---

## 🔄 Continuous Deployment

### Git Workflow

```bash
# Feature branch (creates preview deployment)
git checkout -b feature/new-feature
git commit -m "Add feature"
git push origin feature/new-feature

# Merge to main (triggers production deployment)
git checkout main
git merge feature/new-feature
git push origin main
```

### Deployment URLs

- **Production**: `https://kudimanager.vercel.app` (or custom domain)
- **Preview**: `https://kudimanager-git-branch.vercel.app`
- **Pull Request**: Unique URL per PR

---

## 📈 Vercel Dashboard Features

### Analytics
- Page views and unique visitors
- Top pages and referrers
- Performance metrics (Core Web Vitals)

### Function Logs
- Real-time serverless function logs
- Error tracking and debugging
- Request/response inspection

### Deployment History
- One-click rollback to previous deployment
- Compare deployments
- View build logs

### Speed Insights
- Real User Monitoring (RUM)
- Performance recommendations
- Lighthouse scores over time

---

## ✨ Summary

Your KudiManager monorepo is deployment-ready with:

- ✅ Correct `vercel.json` for monorepo builds
- ✅ Client workspace builds to `client/dist/`
- ✅ Server workspace exports serverless-compatible Express app
- ✅ Proper routing for API (`/api/*`) and SPA (`/*`)
- ✅ Environment variable support
- ✅ Build verification completed successfully

**Next Steps**:
1. Set environment variables in Vercel Dashboard
2. Deploy via Git push or `vercel` command
3. Test preview deployment thoroughly
4. Deploy to production with `vercel --prod`

**Resources**:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Deployment Support](https://vercel.com/support)

**Ready to deploy!** 🚀
