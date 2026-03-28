# Paper5 — Full MERN Stack Website

A complete full-stack digital marketing agency website built with MongoDB, Express, React & Node.js.

## Features
- ✅ Public website (Home, Blog, single post pages)
- ✅ Contact form → saves leads to MongoDB
- ✅ Admin dashboard with stats & charts
- ✅ Leads management (view, filter, update status, notes, delete)
- ✅ Blog CMS (create, edit, publish/unpublish, delete posts)
- ✅ JWT authentication (login, protected admin routes)
- ✅ Fully responsive · Soft cream warm theme

---

## Prerequisites
Make sure you have these installed on your computer:

1. **Node.js** (v18+) → https://nodejs.org
2. **MongoDB Community** (local) → https://www.mongodb.com/try/download/community
   - After installing, MongoDB runs automatically on `mongodb://localhost:27017`

---

## Quick Start (3 steps)

### Step 1 — Install all dependencies
```bash
# In the root paper5/ folder:
npm run install-all
```
This installs packages for root, server and client automatically.

### Step 2 — Configure environment
The server `.env` file is already set up for local development:
```
server/.env
```
You don't need to change anything to run locally. MongoDB will connect to `localhost:27017`.

### Step 3 — Run the app
```bash
# In the root paper5/ folder:
npm run dev
```
This starts both the backend (port 5000) and frontend (port 3000) simultaneously.

Open your browser: **http://localhost:3000**

---

## Create your admin account

### Option A — Built-in API Tester (recommended, no terminal needed)
Once the app is running, go to: **http://localhost:3000/api-tester**

1. Click **Register admin** in the left sidebar
2. Fill in the JSON body with your name, email and password
3. Click **▶ Send** — your token auto-saves
4. You can now test any protected route directly from the browser

### Option B — Command Prompt (Windows cmd, not PowerShell)
```cmd
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Your Name\",\"email\":\"you@paper5.co\",\"password\":\"YourPass123\"}"
```

### Option C — PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Your Name","email":"you@paper5.co","password":"YourPass123"}'
```

Then log in at: **http://localhost:3000/login**

---

## Password recovery

If you forget your password:
1. Go to **http://localhost:3000/login**
2. Click **Forgot password?**
3. Enter your email — a reset link is emailed to you
4. Click the link in the email to set a new password

> **Requires SMTP configured in `server/.env`** — set `SMTP_USER` and `SMTP_PASS` (Gmail App Password).
> To get a Gmail App Password: enable 2FA → visit myaccount.google.com/apppasswords → create one for "Mail".

---

## Project Structure

```
paper5/
├── package.json          ← Root: runs both server + client
│
├── server/               ← Express + MongoDB backend
│   ├── index.js          ← Entry point
│   ├── .env              ← Environment variables
│   ├── models/
│   │   ├── User.js       ← Admin user model
│   │   ├── Lead.js       ← Contact form leads
│   │   └── Post.js       ← Blog posts
│   ├── routes/
│   │   ├── auth.js       ← POST /api/auth/login|register
│   │   ├── contact.js    ← POST /api/contact
│   │   ├── leads.js      ← GET/PATCH/DELETE /api/leads
│   │   └── posts.js      ← GET/POST/PUT/DELETE /api/posts
│   └── middleware/
│       └── auth.js       ← JWT protection middleware
│
└── client/               ← React frontend
    └── src/
        ├── App.js         ← Routes
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   └── Navbar.js
        └── pages/
            ├── Home.js       ← Public homepage
            ├── Blog.js       ← Blog listing
            ├── BlogPost.js   ← Single post
            ├── Login.js      ← Admin login
            └── admin/
                ├── AdminLayout.js  ← Sidebar shell
                ├── Dashboard.js    ← Stats overview
                ├── Leads.js        ← Leads table
                ├── LeadDetail.js   ← Single lead
                ├── Posts.js        ← Posts table
                └── PostEditor.js   ← Create/edit post
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create admin user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/contact | No | Submit contact form |
| GET | /api/leads | Yes | List all leads |
| GET | /api/leads/stats | Yes | Dashboard stats |
| GET | /api/leads/:id | Yes | Single lead |
| PATCH | /api/leads/:id | Yes | Update lead |
| DELETE | /api/leads/:id | Yes | Delete lead |
| GET | /api/posts | No | Published posts |
| GET | /api/posts/admin | Yes | All posts |
| GET | /api/posts/:slug | No | Single post |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes | Update post |
| DELETE | /api/posts/:id | Yes | Delete post |

---

## Deploying to Production

When you're ready to go live:

1. **Backend** → Deploy to [Railway](https://railway.app) or [Render](https://render.com)
2. **Database** → Use [MongoDB Atlas](https://cloud.mongodb.com) (free tier)
3. **Frontend** → Deploy to [Vercel](https://vercel.com) (free)
4. Update `MONGO_URI` and `JWT_SECRET` in production environment variables

---

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Hot Toast
- **Backend**: Node.js, Express 4, Mongoose 7
- **Database**: MongoDB
- **Auth**: JWT + bcryptjs
- **Styling**: Pure CSS with CSS variables (no UI library needed)
