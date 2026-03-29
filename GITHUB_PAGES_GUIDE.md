# GitHub Pages Deployment - Quick Guide

## The Problem
Your project works locally but events don't load on GitHub Pages because:
- GitHub Pages is **static hosting only** (no backend)
- Your backend runs on `localhost:5000` (only accessible locally)
- GitHub Pages can't reach `localhost`

## Solution: Deploy Backend to Render.com

### Quick Setup (5 minutes)

**1. Go to Render Dashboard**
- Visit https://render.com
- Sign in with GitHub
- Click **"New +"** → **"Web Service"**

**2. Connect Your Repo**
- Select `event_managment-project` repository
- Click **"Connect"**

**3. Configure Service**
- **Name**: `event-management-api`
- **Environment**: `Node`
- **Root Directory**: Leave blank or enter `.`
- **Build Command**: `npm install`
- **Start Command**: `cd backend && node setup-db.js && npm start`

**4. Add Environment Variables**
Click **"Add Environment Variable"** and add:
```
DATABASE_URL=postgresql://project_db_gbn8_user:DlKKLH9utVTIxFWD9xkmx8eKkoitFBQm@dpg-d74c1av5r7bs73cqo6u0-a.singapore-postgres.render.com/project_db_gbn8t
NODE_ENV=production
```

**5. Create Service**
- Select **Free** tier
- Click **"Create Web Service"**
- Wait 2-5 minutes for deployment ⏳

**6. Get Your URL**
- Once deployed, copy the URL from Render dashboard
- Should look like: `https://event-management-api.onrender.com`

**7. Update script.js (if needed)**
The current script.js automatically uses:
- `http://localhost:5000` for local development
- `https://project-o2h0.onrender.com` for production

If your Render URL is different, update line 2 in `script.js`.

---

## Deployment Result

After following these steps:

| Where | Events | Registration |
|-------|--------|--------------|
| **Local** | ✅ Works | ✅ Works |
| **GitHub Pages** | ✅ Works | ✅ Works |

✨ Everything connected through Render backend!

---

## What Happens

```
GitHub Pages (Frontend)
        ↓
   API Requests
        ↓
Render Backend (NodeJS)
        ↓
Render Database (PostgreSQL)
```

---

## Testing

After deployment, check:

1. **Open your GitHub Pages URL**
2. **Open browser console** (F12)
3. **Look for console.log messages**:
   - `🔗 API URL: https://...` ✅ Correct URL
   - `📡 Fetching events from:` ✅ Request sent
   - `✓ Events loaded: 5 events` ✅ Success!

4. **If still "No Events Available"**:
   - Wait 15 seconds (cold start)
   - Refresh page
   - Check Render dashboard logs for errors

---

## One More Thing

Each time you push to GitHub:
1. Frontend auto-updates on GitHub Pages ✅
2. Backend needs manual redeploy on Render:
   - Option A: Dashboard → "Manual Deploy"
   - Option B: Come back to Render and set up auto-deploy

---

## Still Having Issues?

Check:
- [ ] Backend URL in console matches Render URL
- [ ] Render service shows "Live" status
- [ ] Database connection string in `.env` is correct
- [ ] Browser Developer Tools (F12) → Network tab for failed requests

See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
