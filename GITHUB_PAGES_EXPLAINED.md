# Why Events Don't Show on GitHub Pages - Explained

## The Issue You're Experiencing

**Local (Live Server)**:
```
You → Browser → http://localhost:5000 ✅
```
Events load because your backend is running locally.

**GitHub Pages**:
```
You → GitHub Pages → ??? → http://localhost:5000 ❌
```
GitHub Pages can't access `localhost:5000` because:
1. It's hosted on GitHub's servers (not your computer)
2. `localhost` only exists on your local machine
3. GitHub Pages is static hosting (no backend attached)

---

## Why It Shows "No Events Available"

1. `script.js` tries to fetch from `API_URL`
2. On GitHub Pages, `API_URL = https://project-o2h0.onrender.com`
3. **BUT** the backend isn't deployed there yet!
4. API request fails → Shows "No Events Available"

---

## The Solution

Deploy your backend to Render.com so both GitHub Pages and your local version can access the same backend.

### Current Setup (After fix)

**script.js automatically detects**:
```javascript
if (localhost) → Use http://localhost:5000 (local dev)
if (github.io) → Use https://project-o2h0.onrender.com (deployed)
```

### What You Need to Do

1. **Deploy backend to Render** (See `DEPLOYMENT_GUIDE.md`)
2. **Push frontend to GitHub Pages** (It's already configured to use Render)
3. **Done!** ✨

---

## Validation Checklist

- [ ] Backend deployed on Render
- [ ] Render URL is live and responding
- [ ] Frontend pushed to GitHub
- [ ] Events showing on GitHub Pages
- [ ] Can register for events

---

## Architecture After Fix

```
┌─────────────────────────────────────────┐
│         GitHub Pages (Frontend)         │
│    index.html, script.js, style.css     │
│      (Hosted on GitHub Servers)         │
└──────────────┬──────────────────────────┘
               │
               │ API Calls
               ↓
┌─────────────────────────────────────────┐
│      Render Backend (Your API)          │
│   Node.js, Express, CORS Enabled        │
│     (Hosted on Render Servers)          │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│    Render PostgreSQL (Database)         │
│    5 Events, Registrations Table        │
│      (Hosted on Render Servers)         │
└─────────────────────────────────────────┘
```

---

## Quick Reference

| File | What It Does |
|------|-------------|
| `script.js` | Auto-detects environment & uses correct API URL |
| `DEPLOYMENT_GUIDE.md` | Step-by-step Render deployment |
| `GITHUB_PAGES_GUIDE.md` | Quick GitHub Pages + Render setup |
| `render.yaml` | Render configuration (auto-detected) |
| Procfile | (Legacy, not needed for Render) |

---

## Next Steps

👉 See **`GITHUB_PAGES_GUIDE.md`** for 5-minute deployment

Or see **`DEPLOYMENT_GUIDE.md`** for detailed step-by-step guide
