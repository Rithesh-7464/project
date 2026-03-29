# Event Management Platform - Production Ready

> A full-stack college event management system with GitHub Pages frontend and Render backend deployment.

---

## 🚀 What's Included

### Frontend
- ✅ 100% Static (GitHub Pages compatible)
- ✅ Responsive Design
- ✅ Toast Notifications
- ✅ Event Display & Registration
- ✅ Real-time Stats

### Backend
- ✅ Node.js/Express API
- ✅ PostgreSQL Database
- ✅ Auto-initialization Scripts
- ✅ CORS Configuration for Production
- ✅ Render-Ready Deployment

### Database
- ✅ PostgreSQL on Render
- ✅ 5 Pre-loaded Events
- ✅ Automatic Schema Creation
- ✅ Secure Credentials

---

## 📦 Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend API | Node.js, Express |
| Database | PostgreSQL |
| Frontend Hosting | GitHub Pages |
| Backend Hosting | Render.com |
| Database Hosting | Render PostgreSQL |

---

## 🛠️ Local Development

### Prerequisites
- Node.js v14+
- PostgreSQL (for local testing)
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/event_managment-project.git
cd event_managment-project

# Setup backend
cd backend
npm install
npm run setup
npm run dev

# Open frontend
# Open index.html in your browser
# Or use Live Server extension
```

### Verify Locally
- Events load from `http://localhost:5000/api/events` ✓
- Can register for events ✓
- Registrations persist ✓

---

## 🌐 Production Deployment

### Quick Deploy (5 minutes)

See **`QUICK_DEPLOY.md`** for 10-step setup

### Detailed Docs

- **`PRODUCTION_DEPLOYMENT.md`** - Complete production guide
- **`GITHUB_PAGES_GUIDE.md`** - GitHub Pages setup
- **`DEPLOYMENT_GUIDE.md`** - Render backend deployment

---

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│        GitHub Pages (Your Frontend)         │
│  ✓ Static Files (HTML, CSS, JS)             │
│  ✓ Auto-hosted from repo                    │
│  ✓ HTTPS enabled                            │
│  URL: https://username.github.io/repo-name  │
└────────────────────┬────────────────────────┘
                     ↓ API Requests
┌─────────────────────────────────────────────┐
│      Render Backend (Your Node API)         │
│  ✓ Express.js Server                        │
│  ✓ CORS configured for GitHub Pages         │
│  ✓ Database connection management           │
│  URL: https://your-service.onrender.com     │
└────────────────────┬────────────────────────┘
                     ↓ Database Queries
┌─────────────────────────────────────────────┐
│    Render PostgreSQL (Your Database)        │
│  ✓ Events table (5 pre-loaded events)       │
│  ✓ Registrations table                      │
│  ✓ Automatic backups                        │
│  ✓ Secure credentials management            │
└─────────────────────────────────────────────┘
```

---

## 📝 Configuration Files

### Frontend
- `index.html` - Main page
- `script.js` - Auto-detects localhost vs GitHub Pages
- `style.css` - Professional dark theme
- `.gitignore` - Excludes node_modules

### Backend
- `backend/server.js` - Express API with CORS
- `backend/db.js` - PostgreSQL connection
- `backend/setup-db.js` - Auto-initialization
- `backend/.env` - Environment variables (not in repo)
- `backend/.env.example` - Template for reference

### Deployment
- `render.yaml` - Render service configuration
- `Procfile` - Process file (legacy support)
- `PRODUCTION_DEPLOYMENT.md` - Full deployment guide
- `QUICK_DEPLOY.md` - Quick reference card

---

## 🔑 Environment Variables

### Required for Production

```env
# Database Connection (from Render)
DATABASE_URL=postgresql://user:password@host:port/database

# Node Environment
NODE_ENV=production

# Server Port (usually 5000 for Render)
PORT=5000
```

### For Production CORS

Update `backend/server.js` with your GitHub Pages URL:

```javascript
const allowedOrigins = [
  "https://YOUR-USERNAME.github.io",
  "https://YOUR-USERNAME.github.io/event_managment-project"
];
```

---

## 📊 Features

### Events
- Display all events with details
- Show categories (Technical, Cultural, Sports)
- Display date, venue, description
- Real-time event count

### Registration
- Simple registration form
- Dropdown event selector
- Email validation
- Toast notifications for feedback

### Registrations List
- Show all registered students
- Display event name with registration
- Real-time registration count
- Persistent across sessions

### User Experience
- Responsive design
- Toast notifications (no popups)
- Smooth animations
- Professional dark theme
- Console debugging info

---

## 🔍 Debugging

### Check in Browser Console (F12)

**Expected logs:**
```
🚀 Environment: production
🌐 Hostname: your-username.github.io
🔗 API URL: https://your-service.onrender.com
📡 Fetching events from: https://...
✓ Events loaded: 5 events
```

### Check Render Logs

1. Render Dashboard → Your Service
2. Click "Logs" tab
3. Look for:
   ```
   ✓ Server running on port 5000
   ✓ Database tables already exist
   ✓ 5 events available
   ```

---

## 🚀 First-Time Production Deploy

### For GitHub Pages

1. Push code to main branch
2. Go to Settings → Pages
3. Enable Pages from main branch
4. Wait 1-2 minutes for deployment
5. Your site is live! 🎉

### For Render Backend

1. Create Render account (GitHub login)
2. Create Web Service
3. Connect repository
4. Add DATABASE_URL env var
5. Deploy (2-5 minutes)
6. Copy service URL

### Connect Frontend to Backend

1. Update `allowedOrigins` in `server.js` with GitHub Pages URL
2. Push to GitHub
3. Render auto-redeploys
4. Test on GitHub Pages
5. Everything works together! 🎉

---

## 📱 Test Scenarios

### Scenario 1: Event Loading
```
✅ Open GitHub Pages URL
✅ Should see 5 events
✅ Console shows no errors
✅ API URL points to Render
```

### Scenario 2: Registration
```
✅ Fill in student name & email
✅ Select event from dropdown
✅ Click "Register Now"
✅ See green toast: "Registration successful!"
✅ Registration count increases
✅ Student appears in registrations list
```

### Scenario 3: Persistence
```
✅ Register for event
✅ Refresh page
✅ Registration still there
✅ Event count accurate
```

---

## 🔐 Production Security

| Area | Implementation |
|------|-----------------|
| **Frontend** | HTTPS via GitHub Pages ✓ |
| **Backend** | HTTPS via Render ✓ |
| **Database** | Encrypted connection ✓ |
| **CORS** | Restricted to known domains ✓ |
| **Environment Variables** | Not in repository ✓ |
| **Database URL** | In .env (git ignored) ✓ |

---

## 📈 Performance

- **Frontend**: Lightning fast (static hosting)
- **Backend**: ~200ms API response time
- **Database**: Optimized queries with indexes
- **Load Time**: <2 seconds full page load

---

## 🛠️ Troubleshooting

### "No Events Available"
- [ ] Check browser console (F12)
- [ ] Verify API URL in console logs
- [ ] Render service should be "Live"
- [ ] Wait 30 seconds (cold start)
- [ ] Check CORS allowedOrigins in server.js

### CORS Error
- [ ] Add GitHub Pages URL to allowedOrigins
- [ ] Restart Render service
- [ ] Push changes to trigger auto-redeploy
- [ ] Clear browser cache

### 503 Service Unavailable
- [ ] Wait 30 seconds for service startup
- [ ] Check Render logs for errors
- [ ] Restart service manually

See detailed guides for more troubleshooting.

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **QUICK_DEPLOY.md** | Quick reference card (START HERE!) |
| **PRODUCTION_DEPLOYMENT.md** | Comprehensive deployment guide |
| **GITHUB_PAGES_GUIDE.md** | GitHub Pages setup guide |
| **DEPLOYMENT_GUIDE.md** | Render backend setup guide |
| **GITHUB_PAGES_EXPLAINED.md** | Why it doesn't work locally on Pages |
| **SETUP_GUIDE.md** | Local development guide |

---

## 🎯 Next Steps

1. **Read**: `QUICK_DEPLOY.md` (5 min read)
2. **Deploy Frontend**: Push to GitHub + enable Pages
3. **Deploy Backend**: Create Render service
4. **Test**: Visit GitHub Pages URL
5. **Monitor**: Check Render logs weekly

---

## 📞 Support

Need help? Check:
- File: `PRODUCTION_DEPLOYMENT.md` (comprehensive)
- File: `QUICK_DEPLOY.md` (quick reference)
- Console: Browser F12 for debug logs
- Logs: Render dashboard for backend logs

---

## ✅ Production Checklist

**Before Going Live:**
- [ ] All events loading (5/5)
- [ ] Registration working
- [ ] Toast notifications visible
- [ ] GitHub Pages URL live
- [ ] Render backend live
- [ ] CORS configured
- [ ] Database connected

**After Going Live:**
- [ ] Monitor Render logs daily
- [ ] Test registration weekly
- [ ] Check GitHub Pages loads
- [ ] Monitor database growth
- [ ] Plan for scaling (if needed)

---

## 📦 Deployment Commands

### Local Development
```bash
cd backend
npm install
npm run setup
npm run dev
```

### Deploy to Render
```bash
# Push to GitHub (Render auto-detects)
git add .
git commit -m "Update"
git push origin main

# Or manually deploy in Render dashboard
# Dashboard → Your Service → Manual Deploy
```

---

**Version**: 1.0.0 - Production Ready
**Last Updated**: March 29, 2026
**Status**: ✅ Ready to Deploy

---

## 🎉 You're All Set!

Your event management platform is production-ready. Follow `QUICK_DEPLOY.md` to get started!

Questions? See the comprehensive guides in this repository.
