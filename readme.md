# Fruitopia — Universal Install & Deploy Guide

This project ships ready for **any** hosting platform. Pick your path below.

---

## 1. Prerequisites (everyone)

1. **Node.js 18+** installed locally (only needed if you build yourself).
2. A **Firebase project** (free Spark plan is fine):
   - Go to https://console.firebase.google.com → **Add project**.
   - Add a **Web App** (the `</>` icon) → copy the config snippet.
   - Enable **Firestore Database** (Production mode).
   - Enable **Authentication → Sign-in providers → Email/Password + Google**.
3. Unzip this archive and open the folder.

---

## 2. First-time config (one-time)

```bash
npm install
npm run build      # produces dist/
npm start          # starts on http://localhost:3005
```

Open http://localhost:3005 → the **Install Wizard** appears.
Paste your Firebase config values → Save. Done.

> The wizard writes `dist/firebase-config.json` and `dist/install-helper.lock`.
> Delete the lock file to re-run the wizard.

---

## 3. Deploy — pick your platform

### A) Vercel (free)
1. Push the folder to GitHub.
2. vercel.com → **New Project** → import the repo.
3. Framework preset: **Other**. Build command auto-detected from `vercel.json`.
4. Add the 6 Firebase values as **Environment Variables** (`FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`).
5. Deploy. All `/api/*` routes go through one serverless function — **no 12-function limit issue**.

### B) Netlify (free)
1. Push to GitHub → netlify.com → **Add new site → Import from Git**.
2. Config is auto-detected from `netlify.toml`.
3. Add the same 6 env vars in **Site Settings → Environment Variables**.
4. Deploy.

### C) Render (free tier — sleeps after 15 min idle)
1. Push to GitHub → render.com → **New → Web Service**.
2. Config is auto-detected from `render.yaml`.
3. Add env vars in the dashboard → Deploy.

### D) Railway (free $5/mo credit)
1. Push to GitHub → railway.app → **New Project → Deploy from GitHub**.
2. Config from `railway.json`. Add env vars → Deploy.

### E) cPanel / Shared hosting (with Node.js Selector)
1. cPanel → **Setup Node.js App** → create app, Node 18+, App root = upload folder.
2. Run `NPM Install`, then set startup file to `server.mjs`, click **Run**.
3. Upload `public/.htaccess` to your `public_html` (already included) — it proxies `/api/*` to the Node app on port 3005.

### F) cPanel — static only (no Node)
If your host has no Node support, you can still serve the frontend:
1. Run `npm run build` locally.
2. Upload **only the contents of `dist/`** to `public_html`.
3. Payment + email API features will be disabled (frontend will still work for browsing / Firebase auth / Firestore).

### G) Any VPS / Docker / self-hosted
```bash
npm install && npm run build && NODE_ENV=production npm start
# Put nginx/Caddy in front for HTTPS.
```

---

## 4. Optional: reCAPTCHA

Admin panel → **Settings → Security** → toggle reCAPTCHA on and paste your site key + secret key from https://www.google.com/recaptcha/admin.

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| "Google Sign-In requires Firebase to be configured" | Wizard not completed, or env vars missing on the host. |
| Vercel "12 Serverless Functions" error | Already fixed — only one function (`api/index.js`) is shipped. |
| Vercel "Cannot find module 'firebase-admin'" | `firebase-admin` is in `dependencies`, not devDependencies — just redeploy. |
| `/api/*` returns 404 on cPanel | Make sure Node.js app is running and `.htaccess` proxy is in `public_html`. |
| Reinstall wizard | Delete `dist/install-helper.lock` (or `install-helper.lock` in dev). |

---

## File layout

```
app.mjs               ← shared Express app (all API routes)
server.mjs            ← Node runner (dev + production)
api/index.js          ← Vercel single-function wrapper
netlify/functions/    ← Netlify single-function wrapper
vercel.json           ← Vercel config
netlify.toml          ← Netlify config
render.yaml           ← Render config
railway.json          ← Railway config
Procfile              ← Heroku / generic PaaS
public/.htaccess      ← cPanel / Apache proxy + SPA fallback
```
