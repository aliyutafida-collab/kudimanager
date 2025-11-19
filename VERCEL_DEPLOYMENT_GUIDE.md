# Vercel Deployment Guide - KudiManager

## 🚀 Quick Deploy Instructions

### Step 1: Vercel Project Settings

**DO NOT set Root Directory to "client"**. Keep it at the repository root (`.` or blank).

**Reason**: The backend code (`api/` folder) must be accessible to Vercel for serverless functions to work.

### Step 2: Build Configuration

Vercel should auto-detect these settings from `vercel.json`:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### Step 3: Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
SESSION_SECRET=your-secret-here
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Apply to: **Production, Preview, and Development**

### Step 4: Deploy with Cache Disabled

#### Option A: Via Vercel Dashboard
1. Go to **Deployments** tab
2. Click **"···"** on latest deployment
3. Select **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **Redeploy**

#### Option B: Via CLI
```bash
npm i -g vercel
vercel --prod --force
```

---

## 📋 Architecture Explanation

### Why This Configuration?

Your project has a specific architecture that's already optimized for Vercel:

```
project-root/
├── api/                  # ✅ Serverless functions (production)
│   ├── [...path].ts      # ✅ Vercel serverless entry point
│   ├── app.ts            # ✅ Express app (no app.listen())
│   └── routes.ts         # ✅ API routes
├── server/               # ⚠️ Development server ONLY
│   ├── index.ts          # ❌ Cannot run as serverless (calls app.listen())
│   └── vite.ts           # Development Vite middleware
├── client/               # Frontend source code
│   └── src/
└── dist/
    └── public/           # ✅ Frontend build output
```

### Key Points:

1. **api/[...path].ts is the serverless entry point**
   - Exports Express app correctly for Vercel
   - No `app.listen()` call
   - Ready for serverless execution

2. **server/index.ts is for development only**
   - Creates HTTP server with `app.listen()`
   - Uses Vite middleware for HMR
   - **Cannot run as Vercel serverless function**

3. **Frontend builds to dist/public/**
   - Configured in `vite.config.ts`
   - Vercel serves these static files
   - API requests go to `/api/*` (handled by serverless)

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T: Set Root Directory to "client"

**Problem**: This hides the `api/` folder from Vercel, breaking all API routes.

**Correct**: Leave root directory blank or set to `.`

### ❌ DON'T: Route to server/index.ts

**Problem**: `server/index.ts` calls `app.listen()` which serverless functions can't do.

**Correct**: Vercel auto-detects `api/[...path].ts` as the serverless entry.

### ❌ DON'T: Change Vite output to client/dist

**Problem**: Breaks existing build configuration and deployment setup.

**Correct**: Keep `outDir: dist/public` in `vite.config.ts`

---

## 🧪 Testing After Deployment

### 1. Check Homepage
Visit your Vercel URL: `https://your-project.vercel.app`
- Should load the frontend without errors
- No API code should be visible in browser

### 2. Test API
Open browser DevTools → Network tab
- Navigate to login page
- Attempt to login
- Check that `/api/login` request succeeds

### 3. Verify Serverless Functions
In Vercel Dashboard:
- Go to **Deployments** → Click your deployment
- Click **Functions** tab
- You should see `api/[...path]` listed

---

## 🔧 Troubleshooting

### Problem: "Module not found" errors
**Solution**: Run `npm install` locally, commit `package-lock.json`, redeploy

### Problem: API returns 404
**Solution**: 
1. Verify `api/[...path].ts` exists
2. Check `vercel.json` rewrites configuration
3. Ensure routes in `api/routes.ts` don't have `/api` prefix

### Problem: Frontend shows API code
**Solution**:
1. Verify `outputDirectory: "dist/public"` in `vercel.json`
2. Check that `npm run build` creates `dist/public/index.html`
3. Redeploy with cache disabled

### Problem: CORS errors
**Solution**: 
1. Add your Vercel domain to `api/app.ts` allowedOrigins:
   ```typescript
   const allowedOrigins = [
     'https://your-project.vercel.app',
     // ... other domains
   ];
   ```
2. Redeploy

---

## 📊 What Happens During Deployment

1. **Vercel runs**: `npm install`
2. **Vercel runs**: `npm run build`
   - Vite builds frontend → `dist/public/`
   - esbuild bundles server → `dist/index.js` (not used in production)
3. **Vercel detects**: `api/[...path].ts` as serverless function
4. **Vercel serves**:
   - Static files from `dist/public/`
   - API requests routed to `api/[...path].ts`

---

## ✅ Verification Checklist

After deployment:

- [ ] Homepage loads correctly
- [ ] No build errors in Vercel logs
- [ ] API endpoints respond (test `/api/login`)
- [ ] Environment variables are set
- [ ] Latest commit is deployed (check commit hash)
- [ ] Browser console has no errors
- [ ] Login/register works
- [ ] Dashboard loads after login

---

## 🎯 Current Configuration (CORRECT)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": "dist/public",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ]
}
```

**This configuration**:
- ✅ Uses root directory (doesn't hide backend)
- ✅ Routes API to correct serverless entry
- ✅ Serves frontend from correct build output
- ✅ Works with existing project structure
- ✅ No code changes needed

---

## 📞 Need Help?

If deployment fails:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure `npm run build` succeeds locally
4. Review this guide's troubleshooting section
5. Check that `api/[...path].ts` exists and exports the app correctly
