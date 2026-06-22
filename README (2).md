# Paper5 — Developer README
> For: Raahat Gilani | Full-Stack Developer

Welcome to the Paper5 codebase! This doc will get you from zero to a fully running local dev environment. Read it fully before running anything.

---

## Table of Contents
1. [What is Paper5?](#what-is-paper5)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Environment Setup](#environment-setup)
7. [Running the App](#running-the-app)
8. [Key Routes & Pages](#key-routes--pages)
9. [API Endpoints](#api-endpoints)
10. [Database Models](#database-models)
11. [Known Pending Items](#known-pending-items)

---

## What is Paper5?

Paper5 (paper5.co) is a full-stack digital marketing agency platform based in Ludhiana, Punjab. It targets PAN India and international clients, offering:

- **SEO** — Search engine optimization services
- **Social Media Marketing** — Content, strategy, and growth
- **Website Design & Development** — Custom web solutions
- **Paid Advertising** — Google Ads, Meta Ads, and more

The platform has a public-facing marketing site and a private admin panel for managing leads and blog posts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Email | Nodemailer (Gmail SMTP) |
| Rich Text | React Quill |
| Dev tooling | Nodemon, Concurrently |

---

## Project Structure

```
paper5/
├── package.json          # Root — runs both client & server together
│
├── client/               # React frontend (Create React App)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js        # Routes defined here
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.js      # JWT auth state (login/logout)
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── WhatsAppButton.js   # ⚠️ Has placeholder number
│   │   │   ├── Testimonials.js
│   │   │   └── RichEditor.js
│   │   └── pages/
│   │       ├── Home.js             # ⚠️ Has placeholder number
│   │       ├── ServicePage.js      # ⚠️ Has placeholder number
│   │       ├── WebsiteServicePage.js
│   │       ├── Blog.js
│   │       ├── BlogPost.js
│   │       ├── Portfolio.js
│   │       ├── Careers.js
│   │       ├── FAQ.js
│   │       ├── Login.js
│   │       ├── ResetPassword.js
│   │       ├── NotFound.js
│   │       ├── APITester.js
│   │       └── admin/
│   │           ├── AdminLayout.js
│   │           ├── Dashboard.js
│   │           ├── Leads.js
│   │           ├── LeadDetail.js
│   │           ├── Posts.js
│   │           ├── PostEditor.js
│   │           └── ChangePassword.js
│   └── package.json
│
└── server/               # Express backend
    ├── index.js          # Entry point, MongoDB connection
    ├── .env              # Environment variables (never commit this)
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── User.js
    │   ├── Lead.js
    │   └── Post.js
    ├── routes/
    │   ├── auth.js       # Login, register, password reset
    │   ├── leads.js      # CRM leads management
    │   ├── posts.js      # Blog CRUD
    │   └── contact.js    # Contact form → email + lead
    └── utils/
        └── email.js      # Nodemailer email helpers
```

---

## Prerequisites

Make sure you have the following installed before starting:

- **Node.js** v18 or v20 (avoid v24 — known compatibility issues with this CRA setup)
- **npm** v9+
- **MongoDB** — either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`, OR
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster
- **Git**

Check versions:
```bash
node -v
npm -v
mongod --version
```

---

## Installation

### 1. Clone the repo

```bash
git clone <repo-url>
cd paper5
```

### 2. Install all dependencies at once

The root `package.json` has a handy script that installs dependencies for the root, server, and client in one command:

```bash
npm run install-all
```

This is equivalent to:
```bash
npm install                   # root (installs concurrently)
cd server && npm install      # backend deps
cd ../client && npm install   # frontend deps
```

---

## Environment Setup

The server reads from `server/.env`. A template is already in place — you just need to fill in the real values.

```bash
# server/.env

PORT=5000
MONGO_URI=mongodb://localhost:27017/paper5   # or your Atlas URI

# Change this to a strong random string in production
JWT_SECRET=paper5_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

NODE_ENV=development

# Email — required for contact form and password reset
# Use a Gmail account with 2FA enabled
# Generate an App Password at: myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@paper5.co

# Password reset
RESET_TOKEN_EXPIRE_MINUTES=15
CLIENT_URL=http://localhost:3000
```

> **Note:** If you don't have email set up yet, the server will still start — email features (contact form, password reset) just won't work until configured.

**Using MongoDB Atlas instead of local?**
Replace `MONGO_URI` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/paper5?retryWrites=true&w=majority
```

---

## Running the App

From the **root** of the project, run:

```bash
npm run dev
```

This starts both the backend and frontend simultaneously using `concurrently`:

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend (Express) | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |

### Running individually (if needed)

```bash
# Backend only
npm run server

# Frontend only
npm run client
```

---

## Key Routes & Pages

### Public Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero, services overview, counters, testimonials |
| `/services/:slug` | ServicePage | SEO, SMM, Paid Ads |
| `/services/website-design` | WebsiteServicePage | Dedicated web dev page |
| `/portfolio` | Portfolio | Case studies |
| `/blog` | Blog | All posts |
| `/blog/:slug` | BlogPost | Single post |
| `/careers` | Careers | Job listings |
| `/faq` | FAQ | Accordion FAQ |

### Auth

| Route | Page |
|---|---|
| `/login` | Admin login |
| `/reset-password` | Password reset |

### Admin Panel (JWT-protected)

| Route | Page |
|---|---|
| `/admin` | Dashboard |
| `/admin/leads` | Leads list |
| `/admin/leads/:id` | Lead detail |
| `/admin/posts` | Blog posts |
| `/admin/posts/new` | Create post |
| `/admin/posts/:id/edit` | Edit post |
| `/admin/change-password` | Change password |

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Login, returns JWT |
| POST | `/register` | Register admin user |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password/:token` | Reset with token |

### Leads — `/api/leads` (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all leads |
| GET | `/:id` | Get single lead |
| PATCH | `/:id` | Update lead status |
| DELETE | `/:id` | Delete lead |

### Posts — `/api/posts`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all published posts |
| GET | `/:slug` | Get post by slug |
| POST | `/` | Create post (JWT required) |
| PUT | `/:id` | Update post (JWT required) |
| DELETE | `/:id` | Delete post (JWT required) |

### Contact — `/api/contact`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Submit contact form → saves lead + sends email |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server status check |

---

## Database Models

### User
```
name, email, password (hashed), role, resetPasswordToken, resetPasswordExpire
```

### Lead
```
name, email, phone, service, message, status (new/contacted/converted/closed), createdAt
```

### Post
```
title, slug (auto-generated), content (HTML), excerpt, author, published (bool), createdAt
```

---

## Known Pending Items

These are things flagged before launch — please coordinate with Harsh before touching them:

1. **WhatsApp number placeholder** — The number `919999999999` is hardcoded in three files. Replace with the real number:
   - `client/src/components/WhatsAppButton.js`
   - `client/src/pages/Home.js`
   - `client/src/pages/ServicePage.js`

2. **JWT Secret** — Must be changed to a strong random string before going to production. Never commit `.env` to git.

3. **Admin user creation** — There's no seeder script. Use the `/api/auth/register` endpoint once locally to create the first admin account, then lock it down.

4. **Email credentials** — SMTP config in `.env` needs real Gmail App Password to enable contact form and password reset flows.

---

> Questions? Ping Harsh directly. Welcome to the team! 🚀
