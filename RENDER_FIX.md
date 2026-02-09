# 🚨 QUICK FIX: Database Connection Error on Render

## The Problem
Your backend can't connect to PostgreSQL because `DATABASE_URL` is not set or incorrect.

## ✅ SOLUTION (Choose One):

### Option A: Manual Fix (5 minutes)

1. **Get Database URL:**
   - Go to: https://dashboard.render.com
   - Click on your PostgreSQL database: `wakaruku-db`
   - Find **"Internal Database URL"**
   - Click copy icon
   - Should look like: `postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com:5432/dbname`

2. **Set Environment Variable:**
   - Go to your backend service: https://dashboard.render.com/web/wakaruku-petrol-station-management-system
   - Click **Environment** tab
   - Find or add `DATABASE_URL`
   - Paste the Internal Database URL
   - Click **Save Changes**

3. **Redeploy:**
   - Click **Manual Deploy** → **Deploy latest commit**
   - Wait 2-3 minutes
   - Check logs for: "Database connection established successfully"

### Option B: Use Blueprint (Automatic)

1. Delete current backend service (keep database!)
2. Go to: https://dashboard.render.com
3. Click **New** → **Blueprint**
4. Connect your GitHub repo
5. Render will read `render.yaml` and auto-configure everything

## 🔍 Verify It's Fixed

After deployment, check logs should show:
```
Database connection established successfully.
Database synchronized.
Server running on port 10000
```

Visit: https://wakaruku-petrol-station-management-system.onrender.com/api/health

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123
}
```

## 🐛 Still Not Working?

Run debug script in Render Shell:
```bash
node debug-db.js
```

This will show if DATABASE_URL is set correctly.

## ⚠️ Common Mistakes

❌ Using External Database URL (starts with `postgres://` from outside Render)  
✅ Use Internal Database URL (for services in same region)

❌ Database and backend in different regions  
✅ Both must be in same region (e.g., Oregon)

❌ Typo in DATABASE_URL  
✅ Copy-paste exactly from Render dashboard

## 📞 Need Help?

Check your Render dashboard:
- Database: https://dashboard.render.com (find your PostgreSQL)
- Backend: https://dashboard.render.com/web/wakaruku-petrol-station-management-system
- Logs: Click on backend service → **Logs** tab
