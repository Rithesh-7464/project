# Deploying Backend to Render.com

## Problem
- GitHub Pages hosts static files only
- It cannot access your local backend (`http://localhost:5000`)
- Events show up locally but not on GitHub Pages

## Solution: Deploy Backend to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Verify your email

### Step 2: Create Web Service on Render

1. **Dashboard** → Click **"New +"** → Select **"Web Service"**
2. **Connect Repository**:
   - Select your GitHub repo (`event_managment-project`)
   - Confirm authorization
3. **Configuration**:
   - **Name**: `event-management-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `cd backend && node setup-db.js && node server.js`
   - Or simpler: `cd backend && npm start` (if using npm run setup separately)

4. **Environment Variables** (Important!):
   - Click **"Add Environment Variable"**
   - Add these variables:
     ```
     DATABASE_URL=postgresql://project_db_gbn8_user:DlKKLH9utVTIxFWD9xkmx8eKkoitFBQm@dpg-d74c1av5r7bs73cqo6u0-a.singapore-postgres.render.com/project_db_gbn8t
     PORT=5000
     NODE_ENV=production
     ```

5. **Pricing & Deploy**:
   - Select **Free** tier
   - Click **"Create Web Service"**
   - Wait for deployment (2-5 minutes)

### Step 3: Get Your Backend URL

Once deployed:
1. Go to your service dashboard on Render
2. Copy the URL (should look like: `https://event-management-api.onrender.com`)
3. Update `script.js` if needed

### Step 4: Update Frontend (if URL changed)

If your Render URL is different, update `script.js`:

```javascript
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:5000"
  : "https://YOUR_RENDER_URL.onrender.com";
```

### Step 5: Setup Database on Render

After deployment:
1. Open your Render service URL in browser
2. Should see: "College Event Management Backend with PostgreSQL is running 🚀"
3. Database tables auto-create on first run

### Alternative: One-Command Deploy to Render

```bash
# From your project directory
npm install -g render-cli
render login
render deploy
```

## Verify Deployment

Test if your backend is accessible:

```powershell
# Test API
(Invoke-WebRequest -Uri "https://YOUR_RENDER_URL.onrender.com/api/events" -UseBasicParsing).Content

# Should return JSON array with 5 events
```

## Render Service Management

### View Logs
- Dashboard → Your service → **Logs** tab
- Check for errors during startup

### Redepoy
- **Manual**: Dashboard → **Manual Deploy** dropdown → **Deploy Latest Commit**
- **Auto**: Set to auto-deploy on GitHub push

### Free Tier Limits
- Services spin down after 15 mins of inactivity
- Takes a few seconds to wake up (cold start)
- No database backups on free tier
- Up to 0.5GB RAM

## GitHub Pages + Render Workflow

Now your GitHub Pages site will:
1. ✅ Load from GitHub Pages (static files)
2. ✅ Fetch events from Render backend
3. ✅ Store registrations in Render PostgreSQL
4. ✅ All working together!

## Troubleshooting

### "No Events Available" on GitHub Pages
- Check browser console (F12 → Console tab)
- Look for API URL and error messages
- Verify Render service is running and not spun down
- Wait 10-15 seconds and refresh (cold start)

### 503 Service Unavailable
- Render service might be starting
- Wait 30 seconds and try again
- Check Render dashboard for errors

### CORS Errors
- Backend should have `app.use(cors())` (it does)
- If still issues, Render might be blocking requests
- Contact Render support

## Complete Deployment Checklist

- [ ] Created account on Render.com
- [ ] Pushed code to GitHub
- [ ] Created Web Service on Render
- [ ] Added DATABASE_URL environment variable
- [ ] Deployed successfully
- [ ] Backend URL accessible in browser
- [ ] Events loading on GitHub Pages
- [ ] Registration working

## Next Steps

1. Deploy backend to Render following steps above
2. Test events load on GitHub Pages
3. Commit and push changes
4. Monitor Render service logs if issues

Questions? Check Render docs: https://render.com/docs
