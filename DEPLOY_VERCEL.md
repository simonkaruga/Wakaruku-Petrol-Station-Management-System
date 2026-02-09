# 🚀 Deploy Frontend to Vercel

## Step-by-Step Guide

### Prerequisites
- ✅ GitHub account
- ✅ Backend deployed on Render
- ✅ Frontend code pushed to GitHub

### Step 1: Sign Up / Login to Vercel

1. Go to: https://vercel.com
2. Click **Sign Up** or **Login**
3. Choose **Continue with GitHub** (recommended)
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. **From Vercel Dashboard:**
   - Click **Add New...** → **Project**
   - Or go to: https://vercel.com/new

2. **Import Git Repository:**
   - Find: `simonkaruga/Wakaruku-Petrol-Station-Management-System`
   - Click **Import**

### Step 3: Configure Project

#### Basic Settings:

| Setting | Value |
|---------|-------|
| **Project Name** | `wakaruku-petrol-station` |
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` ⚠️ **Important!** |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

#### ⚠️ CRITICAL: Set Root Directory

1. Click **Edit** next to Root Directory
2. Select: `frontend`
3. This tells Vercel your frontend code is in the `frontend` folder

### Step 4: Environment Variables

Click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://wakaruku-petrol-station-management-system.onrender.com` |

**How to add:**
1. Name: `VITE_API_URL`
2. Value: `https://wakaruku-petrol-station-management-system.onrender.com`
3. Environment: Select **Production**, **Preview**, and **Development**
4. Click **Add**

### Step 5: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build
3. You'll see:
   ```
   ✓ Building...
   ✓ Uploading...
   ✓ Deployment Ready
   ```

### Step 6: Get Your URL

After deployment, you'll get a URL like:
```
https://wakaruku-petrol-station.vercel.app
```

Or custom domain:
```
https://wakaruku-petrol-station-git-main-simonkaruga.vercel.app
```

### Step 7: Update Backend CORS

⚠️ **IMPORTANT:** Add your Vercel URL to backend CORS

1. Go to Render backend: https://dashboard.render.com
2. Click your backend service
3. Go to **Environment** tab
4. Update `ALLOWED_ORIGINS`:
   ```
   https://wakaruku-petrol-station.vercel.app,http://localhost:3000
   ```
5. Click **Save Changes**
6. Backend will auto-redeploy

### Step 8: Test Your Deployment

Visit your Vercel URL and test:
- ✅ Login page loads
- ✅ Can login with credentials
- ✅ Dashboard loads
- ✅ API calls work

## 🔧 Troubleshooting

### Build Failed

**Check:**
1. Root Directory is set to `frontend`
2. Build command is `npm run build`
3. Output directory is `dist`

**Common Fix:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### API Calls Failing

**Check:**
1. `VITE_API_URL` environment variable is set
2. Backend CORS includes your Vercel URL
3. Backend is running on Render

**Test Backend:**
```bash
curl https://wakaruku-petrol-station-management-system.onrender.com/api/health
```

### 404 on Page Refresh

Already fixed with `vercel.json` rewrites! ✅

### Environment Variable Not Working

**Solution:**
1. Go to Vercel project settings
2. Click **Environment Variables**
3. Verify `VITE_API_URL` is set
4. Redeploy: **Deployments** → **...** → **Redeploy**

## 🎨 Custom Domain (Optional)

### Add Custom Domain:

1. Go to project **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `wakaruku.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

### Update Backend CORS:
```
ALLOWED_ORIGINS=https://wakaruku.com,https://wakaruku-petrol-station.vercel.app,http://localhost:3000
```

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment

## 📊 Vercel Dashboard Features

### Deployments Tab:
- View all deployments
- See build logs
- Rollback to previous versions

### Analytics Tab:
- Page views
- Performance metrics
- User locations

### Settings Tab:
- Environment variables
- Custom domains
- Build settings

## 🚀 Quick Deploy Commands

### Redeploy Latest:
```bash
# From Vercel dashboard
Deployments → ... → Redeploy
```

### Deploy Specific Commit:
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
```

### Deploy from CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Deploy to production
vercel --prod
```

## 📋 Deployment Checklist

Before deploying:
- [ ] Backend is running on Render
- [ ] Frontend code is pushed to GitHub
- [ ] `.env.production` has correct backend URL
- [ ] `vercel.json` is in root directory

During deployment:
- [ ] Root Directory set to `frontend`
- [ ] Framework preset is Vite
- [ ] `VITE_API_URL` environment variable added
- [ ] Build completes successfully

After deployment:
- [ ] Frontend URL is accessible
- [ ] Login page loads
- [ ] Backend CORS updated with frontend URL
- [ ] Can login and use the app

## 🎯 Your Deployment URLs

After deployment, you'll have:

**Frontend:** `https://wakaruku-petrol-station.vercel.app`  
**Backend:** `https://wakaruku-petrol-station-management-system.onrender.com`

## 💡 Pro Tips

1. **Preview Deployments:**
   - Every branch gets a preview URL
   - Test before merging to main

2. **Environment Variables:**
   - Set different values for Production/Preview
   - Use for API URLs, feature flags

3. **Build Cache:**
   - Vercel caches dependencies
   - Faster subsequent builds

4. **Edge Network:**
   - Your app is deployed globally
   - Fast loading worldwide

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Your Dashboard: https://vercel.com/dashboard
- Build Logs: Check in Deployments tab
- Support: https://vercel.com/support

## ✅ Success!

Your frontend is now:
- ✅ Deployed on Vercel
- ✅ Connected to Render backend
- ✅ Accessible worldwide
- ✅ Auto-deploys on Git push

**Next:** Share your app URL and start using it! 🎉

---

**Your App:** https://wakaruku-petrol-station.vercel.app (after deployment)
