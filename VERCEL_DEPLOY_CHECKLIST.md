# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Build Test (Local)
- [x] Run `npm run build` successfully
- [x] Verify `dist/public/` directory contains frontend files
- [x] Verify `dist/index.js` was created
- [x] No TypeScript or build errors

### 2. Vercel Project Setup

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave blank or use dot)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install` (should auto-detect)

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Deploy to production
vercel --prod
```

### 3. Environment Variables Setup
In Vercel Dashboard → Project Settings → Environment Variables, add:

**Required:**
- `SESSION_SECRET` = `[your-secret-key-here]`
- `VITE_FIREBASE_API_KEY` = `[from Replit Secrets]`
- `VITE_FIREBASE_AUTH_DOMAIN` = `[from Replit Secrets]`
- `VITE_FIREBASE_PROJECT_ID` = `[from Replit Secrets]`
- `VITE_FIREBASE_STORAGE_BUCKET` = `[from Replit Secrets]`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = `[from Replit Secrets]`
- `VITE_FIREBASE_APP_ID` = `[from Replit Secrets]`
- `VITE_FIREBASE_MEASUREMENT_ID` = `[from Replit Secrets]`

**Optional (for cache issues):**
- `VERCEL_FORCE_NO_BUILD_CACHE` = `1`

**Important:** Apply all variables to **Production, Preview, and Development** environments.

### 4. Fix Build Cache Issues (If Needed)

If Vercel is building old code:

1. **Add cache-busting variable:**
   - Go to **Settings** → **Environment Variables**
   - Add `VERCEL_FORCE_NO_BUILD_CACHE` = `1`
   - Apply to all environments
   - Click **Save**

2. **Manual redeploy:**
   - Go to **Deployments** tab
   - Click **"···"** menu on latest deployment
   - Select **"Redeploy"**
   - **Uncheck** "Use existing Build Cache"
   - Click **Redeploy**

### 5. Verify Deployment

After deployment completes:

- [ ] Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
- [ ] Test login/register flow
- [ ] Check browser console for errors
- [ ] Verify API calls work (check Network tab)
- [ ] Test on mobile device
- [ ] Check that latest changes are visible

### 6. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `kudimanager.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

---

## 🔧 Troubleshooting

### Build Fails with Old Code Errors

**Problem:** Error mentions files that don't exist anymore (like `<Suspense>`, `<Routes>`)

**Solution:**
1. Clear build cache (see step 4 above)
2. Verify latest commit is deployed (check commit hash in Vercel)
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### API Endpoints Return 404

**Problem:** Frontend loads but API calls fail

**Solution:**
1. Check `api/` folder exists and has `[...path].ts`
2. Verify `vercel.json` rewrites are correct
3. Check serverless function logs in Vercel dashboard
4. Ensure routes in `api/routes.ts` don't have `/api` prefix

### CORS Errors

**Problem:** Browser shows CORS policy errors

**Solution:**
1. Add your Vercel domain to allowed origins in `api/app.ts`:
   ```typescript
   const allowedOrigins = [
     'https://your-project.vercel.app',
     'https://kudimanager.com',
     // ... other domains
   ];
   ```
2. Redeploy after making changes

### Environment Variables Not Working

**Problem:** App behavior suggests env vars are missing

**Solution:**
1. Verify all variables are set in Vercel dashboard
2. Make sure they're applied to the correct environment (Production/Preview/Development)
3. Redeploy after adding new environment variables
4. Check for typos in variable names (must match exactly)

---

## 📊 Build Output Structure

After `npm run build`, you should see:

```
dist/
├── public/              # Frontend static files (served by Vercel)
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   ├── locales/         # i18n translation files
│   ├── manifest.json    # PWA manifest
│   └── service-worker.js
└── index.js             # Backend bundle (not used by Vercel)

api/                     # Serverless functions (deployed by Vercel)
├── [...path].ts         # Catch-all route handler
├── app.ts               # Express app configuration
├── routes.ts            # API route definitions
└── storage.ts           # Storage interface
```

---

## 🚀 Quick Deploy Commands

```bash
# Test build locally
npm run build

# Deploy to Vercel (production)
vercel --prod

# Deploy to preview
vercel

# Check deployment logs
vercel logs

# Test with Vercel dev server (simulates production)
vercel dev
```

---

## 📝 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": "dist/public",
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

### package.json (build script)
```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

---

## ✨ Post-Deployment

- [ ] Test all features thoroughly
- [ ] Monitor Vercel logs for errors
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)
- [ ] Enable automatic deployments from Git
- [ ] Share your deployed app! 🎉

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)

For detailed technical information, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
