---
title: Nebula Secrets & Security Credentials
type: obsidian-secrets
version: 3.0.0
security_classification: confidential-template
tags:
  - nebula/secrets
  - nebula/security
  - firebase
  - vercel
---

# 🔐 Secrets & Security Configuration

Backlinks: [[Master View]] • [[Cloud Sync & Storage]] • [[Deployment & Operations]]

> [!CAUTION]
> **CRITICAL SECURITY DIRECTIVE**
> Never place raw API secret keys, private database passwords, or production service tokens directly inside committed Git files.
> This note provides the **Sanitized Schema** and **Fallback Architecture** used by Nebula V3.

---

## 📋 Required Environment Variables

Nebula V3 requires the following environment variables during build time or local runtime. Create a `.env.local` file in the project root:

```ini
# Firebase Cloud Database Credentials
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=nebula-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nebula-app
VITE_FIREBASE_STORAGE_BUCKET=nebula-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=1:your_app_id:web:your_hash
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
```

---

## 🛡️ Production Default Fallback Schema

To prevent application crashes when building in automated CI environments or standard Vercel deployments where `.env` files might be omitted, [firebase.js](file:///Users/neo/nEO-apps/app-3/src/lib/firebase.js) implements safe fallback defaults:

```javascript
// Sanitized production fallback in src/lib/firebase.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_demo_fallback_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nebula-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nebula-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nebula-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "100000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:100000000000:web:demo"
};
```

> [!NOTE]
> If `firebaseConfig` fails to establish a remote connection due to fallback credentials, Nebula V3 automatically falls back to **Local-Only Offline Mode** using `localStorage` without disrupting the user UI.

---

## 🌐 Vercel Production Environment Setup

To configure actual secrets in Vercel Dashboard:

1. Navigate to **[Vercel Dashboard](https://vercel.com/neel-codebases-projects/nebula-app/settings/environment-variables)**.
2. Select Project **`nebula-app`** -> **Settings** -> **Environment Variables**.
3. Add the key-value pairs listed in the table below:

| Environment Key | Target Environment | Sensitivity Level | Purpose |
| :--- | :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Production, Preview | High | Client-side Firebase Authentication & SDK Init |
| `VITE_FIREBASE_AUTH_DOMAIN` | Production, Preview | Medium | Firebase OAuth domain authorization |
| `VITE_FIREBASE_PROJECT_ID` | Production, Preview | Low | Firestore Database target identifier |
| `VITE_FIREBASE_APP_ID` | Production, Preview | Medium | Web application instance identifier |

---

## 🔍 Verification Protocol

To verify that secrets are loaded correctly without exposing them in client logs:

```javascript
// Open Browser DevTools Console
console.log('Firebase Init Status:', !!window.db ? 'Cloud Connected' : 'Local Fallback Mode');
```
