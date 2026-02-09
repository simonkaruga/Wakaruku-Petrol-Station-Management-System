# Render Deployment Fixes

## Issues Fixed

### 1. ❌ CORS Error: "Not allowed by CORS"
**Problem:** Backend was rejecting requests due to strict CORS origin checking

**Solution:**
- Modified `server.js` CORS configuration to allow requests with no origin (server-to-server, Postman, health checks)
- Added `.trim()` to clean up origin strings from environment variables
- Added logging to debug CORS issues

**Changes in `backend/server.js`:**
```javascript
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 2. ❌ Database Error: "relation 'users' does not exist"
**Problem:** Database tables were not being created on Render deployment

**Root Cause:**
- The User model uses raw SQL queries instead of Sequelize models
- `sequelize.sync()` doesn't create tables for non-Sequelize models
- The `alter: true` option was trying to modify non-existent tables

**Solution:**
- Created `init-db.js` script that creates all tables using raw SQL
- Updated `render.yaml` to run database initialization during build
- Changed sync option from `alter: true` to `force: false`

**New file: `backend/init-db.js`**
- Creates all database tables if they don't exist
- Creates default admin user (simon/admin123)
- Runs during Render build process

**Changes in `render.yaml`:**
```yaml
buildCommand: npm install && node init-db.js
```

**Changes in `backend/server.js`:**
```javascript
await sequelize.sync({ force: false });
```

## Deployment Steps

### To Deploy These Fixes:

1. **Commit and push changes:**
```bash
git add .
git commit -m "Fix CORS and database initialization for Render deployment"
git push origin main
```

2. **Render will automatically:**
   - Install dependencies
   - Run `init-db.js` to create tables
   - Start the server

3. **Verify deployment:**
   - Check build logs for "✅ Database tables created"
   - Check build logs for "✅ Default admin user created"
   - Test health endpoint: `https://wakaruku-petrol-station-management-system.onrender.com/api/health`
   - Test login with: simon / admin123

## Environment Variables on Render

Make sure these are set in your Render dashboard:

```
NODE_ENV=production
DATABASE_URL=[auto-populated from database]
JWT_SECRET=[auto-generated]
JWT_REFRESH_SECRET=[auto-generated]
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://wakaruku-petrol-station-frontend.vercel.app,https://wakaruku-petrol-station-management-system.onrender.com
FRONTEND_URL=https://wakaruku-petrol-station-frontend.vercel.app
```

## Testing After Deployment

1. **Health Check:**
```bash
curl https://wakaruku-petrol-station-management-system.onrender.com/api/health
```

2. **Login Test:**
```bash
curl -X POST https://wakaruku-petrol-station-management-system.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"simon","password":"admin123"}'
```

3. **Frontend Connection:**
   - Update Vercel frontend environment variable:
   - `VITE_API_URL=https://wakaruku-petrol-station-management-system.onrender.com`

## Troubleshooting

### If CORS errors persist:
1. Check Render logs for "CORS blocked origin" messages
2. Verify ALLOWED_ORIGINS includes your frontend URL
3. Test with Postman (should work now with no origin)

### If database errors persist:
1. Check Render logs for "Database tables created" message
2. Verify DATABASE_URL is set correctly
3. Check PostgreSQL database is running
4. Try manual table creation via Render shell

### If build fails:
1. Check that `init-db.js` exists in backend folder
2. Verify DATABASE_URL is available during build
3. Check PostgreSQL connection from Render

## Files Modified

- ✅ `backend/server.js` - Fixed CORS and database sync
- ✅ `backend/init-db.js` - NEW: Database initialization script
- ✅ `render.yaml` - Updated build command and added FRONTEND_URL

## Next Steps

1. Push changes to GitHub
2. Wait for Render auto-deploy
3. Check deployment logs
4. Test API endpoints
5. Update frontend to use production API URL
6. Change default admin password after first login!
