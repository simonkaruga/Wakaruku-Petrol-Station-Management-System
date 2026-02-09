# 🗄️ Deploy PostgreSQL Database on Render

## Step-by-Step Guide

### Step 1: Sign Up / Login to Render

1. Go to: https://render.com
2. Click **Get Started** or **Sign In**
3. Sign up with:
   - GitHub (recommended - easier integration)
   - GitLab
   - Email

### Step 2: Create PostgreSQL Database

1. **From Dashboard:**
   - Click **New +** button (top right)
   - Select **PostgreSQL**

2. **Configure Database:**

   | Field | Value | Notes |
   |-------|-------|-------|
   | **Name** | `wakaruku-db` | Your database identifier |
   | **Database** | `wakaruku_petrol_db` | Actual database name |
   | **User** | `wakaruku_user` | Database username |
   | **Region** | `Oregon (US West)` | Choose closest to your users |
   | **PostgreSQL Version** | `16` (default) | Latest stable version |
   | **Plan** | **Free** | $0/month, 1GB storage, 90 days |

3. **Click "Create Database"**
   - Wait 2-3 minutes for provisioning
   - Status will change from "Creating" → "Available"

### Step 3: Get Database Connection Details

Once created, you'll see:

#### 📋 Connection Information:

1. **Internal Database URL** (Use this for Render services)
   ```
   postgresql://wakaruku_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com:5432/wakaruku_petrol_db
   ```
   - Click the **copy icon** to copy
   - This is what you'll use for `DATABASE_URL`

2. **External Database URL** (Use for local testing)
   ```
   postgresql://wakaruku_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com:5432/wakaruku_petrol_db
   ```
   - Use this to connect from your local machine

3. **Individual Connection Details:**
   - **Host**: `dpg-xxxxx-a.oregon-postgres.render.com`
   - **Port**: `5432`
   - **Database**: `wakaruku_petrol_db`
   - **Username**: `wakaruku_user`
   - **Password**: `[auto-generated]`

### Step 4: Save Your Credentials

⚠️ **IMPORTANT**: Save these details securely!

Create a file locally (don't commit to Git):
```
DATABASE_URL=postgresql://wakaruku_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com:5432/wakaruku_petrol_db

Host: dpg-xxxxx-a.oregon-postgres.render.com
Port: 5432
Database: wakaruku_petrol_db
Username: wakaruku_user
Password: abc123xyz
```

### Step 5: Test Connection (Optional)

#### From Command Line:
```bash
psql "postgresql://wakaruku_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com:5432/wakaruku_petrol_db"
```

#### Using pgAdmin or DBeaver:
- Host: `dpg-xxxxx-a.oregon-postgres.render.com`
- Port: `5432`
- Database: `wakaruku_petrol_db`
- Username: `wakaruku_user`
- Password: `[your password]`
- SSL Mode: `Require`

### Step 6: Initialize Database Tables

You have 3 options:

#### Option A: Using Render Shell (After backend is deployed)
1. Go to your backend service on Render
2. Click **Shell** tab
3. Run:
   ```bash
   npm run setup
   ```

#### Option B: Using psql Locally
```bash
# Connect to database
psql "postgresql://wakaruku_user:abc123xyz@dpg-xxxxx.oregon-postgres.render.com:5432/wakaruku_petrol_db"

# Run setup script
\i /path/to/backend/setup-manual.sql

# Exit
\q
```

#### Option C: Let Sequelize Auto-Create
Your backend will automatically create tables on first run with:
```javascript
await sequelize.sync({ alter: true });
```

## 📊 Database Plans Comparison

| Plan | Price | Storage | RAM | Expires | Best For |
|------|-------|---------|-----|---------|----------|
| **Free** | $0/month | 1 GB | Shared | 90 days | Testing, demos |
| **Starter** | $7/month | 10 GB | 256 MB | Never | Small production |
| **Standard** | $20/month | 100 GB | 1 GB | Never | Growing apps |
| **Pro** | $65/month | 512 GB | 4 GB | Never | Large scale |

### Free Tier Limitations:
- ⏰ Expires after 90 days
- 💾 1 GB storage limit
- 🔄 Shared resources
- ✅ Perfect for development/testing

## 🔒 Security Best Practices

1. **Never commit credentials to Git**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Use Internal URL for Render services**
   - Faster connection
   - No external bandwidth charges

3. **Use External URL only for:**
   - Local development
   - Database management tools
   - External monitoring

4. **Enable SSL** (already configured in your code)
   ```javascript
   ssl: {
     require: true,
     rejectUnauthorized: false
   }
   ```

## 🔍 Monitoring Your Database

### From Render Dashboard:

1. **Metrics Tab:**
   - CPU usage
   - Memory usage
   - Connection count
   - Storage used

2. **Logs Tab:**
   - Connection logs
   - Query logs
   - Error logs

3. **Info Tab:**
   - Connection details
   - Version info
   - Region

## 🛠️ Common Operations

### View Database Size:
```sql
SELECT pg_size_pretty(pg_database_size('wakaruku_petrol_db'));
```

### List All Tables:
```sql
\dt
```

### View Table Structure:
```sql
\d users
```

### Backup Database:
```bash
pg_dump "postgresql://user:pass@host:5432/dbname" > backup.sql
```

### Restore Database:
```bash
psql "postgresql://user:pass@host:5432/dbname" < backup.sql
```

## ⚠️ Troubleshooting

### Can't Connect to Database

**Check:**
1. ✅ Database status is "Available" (not "Creating")
2. ✅ Using correct URL (Internal for Render, External for local)
3. ✅ SSL is enabled in your connection config
4. ✅ No typos in connection string
5. ✅ Firewall allows port 5432

### Connection Timeout

**Solutions:**
1. Check database region matches backend region
2. Verify database is running (check Render dashboard)
3. Try External URL to test from local machine

### Storage Full

**Solutions:**
1. Check storage usage in Metrics tab
2. Delete old data or upgrade plan
3. Free tier: 1 GB limit

## 📞 Next Steps

After database is created:

1. ✅ Copy Internal Database URL
2. ✅ Set `DATABASE_URL` in backend environment variables
3. ✅ Deploy backend service
4. ✅ Initialize database tables
5. ✅ Test connection

## 🎯 Your Database is Ready!

Your PostgreSQL database is now:
- ✅ Created and running
- ✅ Accessible via connection URLs
- ✅ Ready to connect to your backend
- ✅ Secured with SSL

**Next:** Deploy your backend and connect it using the DATABASE_URL!

---

**Need help?** Check:
- Render Docs: https://render.com/docs/databases
- Your Dashboard: https://dashboard.render.com
- RENDER_FIX.md for connection issues
