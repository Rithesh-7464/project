# Production Deployment Guide
## GitHub Pages + Render + PostgreSQL

---

## 📋 Deployment Checklist

### Phase 1: Pre-Deployment (Local Setup)
- [ ] Clone repository locally
- [ ] Run `npm install` in backend folder
- [ ] Run `npm run setup` to initialize database locally
- [ ] Test locally: `npm start` in backend
- [ ] Verify events load on `index.html`
- [ ] All events and registration working locally

### Phase 2: GitHub Configuration
- [ ] Push repository to GitHub
- [ ] Go to repository Settings → Pages
- [ ] Select `main` branch as source
- [ ] Select `/root` folder (or `/docs` if frontend is there)
- [ ] Wait for GitHub Pages URL (will show: `https://username.github.io/repo-name`)
- [ ] Copy your GitHub Pages URL

### Phase 3: Backend Deployment to Render
- [ ] Create account on Render.com
- [ ] Create Web Service:
  - [ ] Connect GitHub repository
  - [ ] Name: `event-management-backend`
  - [ ] Environment: `Node`
  - [ ] Root Directory: `.` (or leave blank)
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `cd backend && node setup-db.js && npm start`
- [ ] Add Environment Variables:
  - [ ] `DATABASE_URL` = (your PostgreSQL URL)
  - [ ] `NODE_ENV` = `production`
- [ ] Create service and wait for deployment
- [ ] Copy Render service URL

### Phase 4: Configure CORS for GitHub Pages
- [ ] In `backend/server.js`, update `allowedOrigins` array:
  ```javascript
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://your-username.github.io",
    "https://your-username.github.io/event_managment-project"
  ];
  ```
- [ ] Push changes to GitHub (auto-deploys to Render)

### Phase 5: Update Frontend URLs (if needed)
- [ ] Check `script.js` API_URL logic
- [ ] Verify it uses `https://project-o2h0.onrender.com` for production
- [ ] Or update to your actual Render service URL if different

### Phase 6: Final Verification
- [ ] Visit your GitHub Pages URL
- [ ] Open browser console (F12)
- [ ] Check console logs for API_URL and environment
- [ ] Verify events load (✓ Events loaded: 5 events)
- [ ] Try registering for an event
- [ ] Check notification appears
- [ ] Refresh page - registration persists

---

## 🚀 Render Deployment Steps (Detailed)

### Step 1: Go to Render Dashboard
1. Visit https://render.com
2. Sign in with GitHub (recommended)
3. Click **"New +"** button

### Step 2: Select Web Service
1. Click **"Web Service"**
2. Connect your `event_managment-project` repository
3. Click **"Connect"**

### Step 3: Configure Service
```
Name: event-management-backend
Environment: Node
Root Directory: . (or leave blank)
Build Command: npm install
Start Command: cd backend && node setup-db.js && npm start
```

### Step 4: Environment Variables
Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://project_db_gbn8_user:PASSWORD@dpg-d74c1av5r7bs73cqo6u0-a.singapore-postgres.render.com/project_db_gbn8t` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

⚠️ **Keep DATABASE_URL private!** Don't commit it to public repos.

### Step 5: Advanced Settings (Optional)
- **Plan**: Free (for development)
- **Paid**: Pro+ (for production with auto-scaling)
- **Auto-Deploy**: Enable to deploy on every GitHub push

### Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait 2-5 minutes for build and deployment
3. Once live, copy the service URL: `https://your-service-name.onrender.com`

---

## 🔧 CORS Configuration

### Update Backend for Your GitHub Pages Domain

In `backend/server.js`, update the `allowedOrigins` array:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  // Add your GitHub Pages URLs
  "https://your-username.github.io",
  "https://your-username.github.io/event_managment-project",
];
```

Then push to GitHub - Render will auto-redeploy.

---

## 📊 Architecture

```
GitHub Pages                   Render Backend            Render Database
┌──────────────┐              ┌──────────────┐         ┌──────────────┐
│   Frontend   │──API Calls──→│  Node.js     │────────→│  PostgreSQL  │
│ (static)     │              │  Express     │         │              │
└──────────────┘              └──────────────┘         └──────────────┘
your.github.io        event-...onrender.com      postgres.onrender.com
```

---

## 🔍 Testing & Monitoring

### Test Events Load
```bash
# Use your actual Render URL
curl https://your-service-name.onrender.com/api/events
```

Expected response: JSON array with 5 events

### Check Render Logs
1. Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Look for:
   - ✓ `Server running on port 5000`
   - ✓ `Database tables already exist`
   - ✗ Any error messages

### Browser Console (F12)
```
🚀 Environment: production
🌐 Hostname: your-username.github.io
🔗 API URL: https://your-service-name.onrender.com
```

---

## ⚠️ Common Issues & Fixes

### Problem: "No Events Available" on GitHub Pages

**Check #1**: Browser Console (F12)
- Look for: `🔗 API URL:` - Is it pointing to Render?
- Look for: `❌ Error fetching events:` - What's the error?

**Check #2**: Render Status
- Dashboard → Your Service
- Status should be **"Live"** (green)
- If grey/red: redeploy or check logs

**Check #3**: CORS Error
- Look for: `CORS policy violation` in console
- Fix: Add your GitHub Pages URL to `allowedOrigins` in `server.js`

**Check #4**: Cold Start
- Render free tier spins down after 15 minutes
- Takes ~5-30 seconds to wake up
- Solution: Wait and refresh

---

### Problem: CORS Error in Console

```
Access to XMLHttpRequest at 'https://...' from 'https://your-username.github.io' 
has been blocked by CORS policy
```

**Fix**:
1. Add your GitHub Pages URL to `allowedOrigins` in `backend/server.js`
2. Push changes
3. Wait for Render to redeploy
4. Clear browser cache (Ctrl+Shift+Delete)
5. Refresh page

---

### Problem: 503 Service Unavailable

This means Render service is starting or restarting.

**Solutions**:
- Wait 30 seconds and refresh
- Check Render dashboard for errors
- Restart service: Dashboard → More → Restart Service

---

## 📝 Production Environment Variables

### For Render Dashboard

Set these in Render Web Service settings:

```
DATABASE_URL=postgresql://project_db_gbn8_user:PASSWORD@...
NODE_ENV=production
```

### For Local Development

Create `backend/.env`:
```
DATABASE_URL=postgresql://project_db_gbn8_user:PASSWORD@...
PORT=5000
NODE_ENV=development
```

⚠️ **NEVER commit `.env` to GitHub!** It's in `.gitignore`.

---

## 🔐 Security Checklist

- [ ] DATABASE_URL never committed to repo
- [ ] Database password not in code
- [ ] `.env` file added to `.gitignore`
- [ ] CORS restricted to known domains
- [ ] Backend validates all inputs
- [ ] HTTPS enabled (GitHub Pages + Render both use HTTPS)
- [ ] No sensitive data in frontend code

---

## 📱 Multi-Environment Setup

### Local Development
```bash
cd backend
npm install
npm run setup
npm run dev
```

### Production (Render)
Automatically uses:
- Build: `npm install`
- Start: `cd backend && node setup-db.js && npm start`
- Environment: `NODE_ENV=production`

---

## 🔄 Deployment Workflow

### Update Code & Deploy

1. **Make changes locally**
   ```bash
   # Local testing
   npm run dev
   ```

2. **Commit and push**
   ```bash
   git add .
   git commit -m "Update: description"
   git push origin main
   ```

3. **Auto-deployment**
   - ✅ GitHub Pages updates immediately
   - ✅ Render auto-redeploys (if enabled)
   - Manual: Render Dashboard → Redeploy

4. **Verify**
   - Test on GitHub Pages URL
   - Check Render logs
   - Verify events & registration work

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `script.js` | Frontend auto-detects environment & API URL |
| `backend/server.js` | NodeJS/Express backend with CORS |
| `backend/.env` | Environment variables (not in repo) |
| `backend/.env.example` | Template for .env |
| `render.yaml` | Render deployment config |
| `Procfile` | Legacy deployment config |
| `backend/setup-db.js` | Auto-initialize database |

---

## ✅ Post-Deployment Tasks

- [ ] Document your GitHub Pages URL
- [ ] Document your Render service URL  
- [ ] Save DATABASE_URL securely
- [ ] Set up Render alerts
- [ ] Test registration notifications
- [ ] Monitor Render logs weekly
- [ ] Plan database backups (Pro plan feature)

---

## 🆘 Need Help?

**Render Documentation**: https://render.com/docs
**GitHub Pages Docs**: https://pages.github.com
**PostgreSQL Docs**: https://www.postgresql.org/docs

See `GITHUB_PAGES_EXPLAINED.md` for more context.
