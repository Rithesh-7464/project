# Production Setup - Quick Reference Card

## 🎯 What You're Deploying

```
Frontend (GitHub Pages)  →  Backend (Render)  →  Database (Render PostgreSQL)
```

---

## ⚡ 10-Step Quick Deploy

### Frontend (GitHub Pages)

✅ **Step 1**: Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

✅ **Step 2**: Enable GitHub Pages
- Go to: Repository Settings → Pages
- Source: `main` branch, `/root`
- Copy URL: `https://YOUR-USERNAME.github.io/event_managment-project`

### Backend (Render)

✅ **Step 3**: Create Render Account
- Visit: https://render.com
- Sign in with GitHub

✅ **Step 4**: Create Web Service
- Select your repo
- Name: `event-management-backend`
- Root: `.` (blank is okay)
- Build: `npm install`
- Start: `cd backend && node setup-db.js && npm start`

✅ **Step 5**: Add Environment Variables
```
DATABASE_URL=postgresql://project_db_gbn8_user:DlKKLH9utVTIxFWD9xkmx8eKkoitFBQm@dpg-d74c1av5r7bs73cqo6u0-a.singapore-postgres.render.com/project_db_gbn8t

NODE_ENV=production
```

✅ **Step 6**: Deploy
- Click "Create Service"
- Wait 2-5 minutes ⏳
- Copy service URL: `https://event-...onrender.com`

✅ **Step 7**: Update CORS
In `backend/server.js` line ~18, update:
```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://YOUR-USERNAME.github.io",
  "https://YOUR-USERNAME.github.io/event_managment-project"
];
```

✅ **Step 8**: Push Changes
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render auto-redeploys ✓

✅ **Step 9**: Test on GitHub Pages
- Visit: `https://YOUR-USERNAME.github.io/event_managment-project`
- Open console: F12 → Console tab
- Should see: ✓ `🔗 API URL: https://event-...onrender.com`
- Should see: ✓ `✓ Events loaded: 5 events`

✅ **Step 10**: Test Registration
- Fill form
- Click "Register Now"
- Should see green toast: ✓ "Registration successful!"
- Refresh page - should persist

---

## 🔍 Verification Checklist

### ✅ Does It Work?

- [ ] GitHub Pages URL loads
- [ ] Browser console shows no errors
- [ ] API URL points to Render
- [ ] 5 events visible
- [ ] Can register for events
- [ ] Toast notifications appear
- [ ] Event count shows "5"
- [ ] Registrations list updates

---

## 🔑 Important URLs to Keep

```
Frontend URL:     https://YOUR-USERNAME.github.io/event_managment-project
Backend URL:      https://event-management-backend.onrender.com (or your name)
GitHub Repo:      https://github.com/YOUR-USERNAME/event_managment-project
Render Dashboard: https://dashboard.render.com
```

---

## 📱 Environment Detection (Automatic)

Your app auto-detects:

```
If on localhost:5000     → Uses http://localhost:5000
If on GitHub Pages       → Uses https://...onrender.com
```

**No manual URL changes needed!** ✓

---

## ⚠️ If Events Don't Load

**Check 1**: Browser Console (F12)
```
Look for: 🔗 API URL: https://event-...onrender.com
Look for: ❌ Error: CORS policy
```

**Check 2**: Render Service
- Dashboard → Service Status
- Should show "Live" ✓
- Look at Logs for errors

**Check 3**: Wait for Cold Start
- Free tier Render spins down after 15 min
- Takes ~10 secs to wake up
- Try again in 30 seconds

**Check 4**: CORS Setup
- Make sure GitHub Pages URL is in `allowedOrigins`
- Restart Render service
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📧 Need Your GitHub Pages URL?

After enabling Pages, it's auto-generated:
```
https://username.github.io/repository-name
```

Find it at:
- Repository → Settings → Pages → "Your site is live at..."

---

## 🚀 Next Deployments

Future updates are easy:

```bash
# Make changes
git add .
git commit -m "Update description"
git push origin main

# Done! Both GitHub Pages & Render auto-update ✓
```

---

## 📞 Troubleshooting Quick Links

- GitHub Pages Issue? → See `GITHUB_PAGES_GUIDE.md`
- Render Down? → Check `DEPLOYMENT_GUIDE.md`
- CORS Problems? → See `PRODUCTION_DEPLOYMENT.md`
- General Info? → See `README.md`

---

**Status**: ✅ Production Ready!

**Last Updated**: 2026-03-29

**Version**: 1.0.0 - Production Stable
