# Virtual Assistant — Backend

This folder contains the backend server for the Virtual Assistant project.

## Overview
- Node.js + Express backend
- MongoDB for persistence (Atlas or local)
- JWT-based auth with cookies
- Integrates with a LLM (Gemini) to parse voice commands and return JSON intents

## Requirements
- Node.js 18+ (tested)
- MongoDB (Atlas or local)
- npm

## Environment
Create a `.env` in this folder (example in `.env` already). Key variables:

- `PORT` - server port (default 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - signing secret for JWT
- `CLOUDINARY_CLOUD_NAME` - Cloudinary config (if using image uploads)
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GEMINI_API_URL` - Gemini/LLM endpoint (with API key appended)

## Install & Run
Install dependencies and start the server (development):

```bash
cd Backend
npm install
npm run dev
```

The server should start on `http://localhost:3000` (or the `PORT` you set).

## API Endpoints (summary)
- `POST /api/auth/signup` — register (sets httpOnly cookie)
- `POST /api/auth/signin` — login (sets token cookie)
- `GET /api/auth/logout` — clear token cookie
- `GET /api/user/current` — get current authenticated user
- `POST /api/user/update` — update assistant name/image (authenticated)
- `POST /api/user/asktoassistant` — pass user command to Gemini and return intent/response

> Many endpoints require authentication — backend uses a cookie `token` (JWT). Frontend uses `axios(..., { withCredentials: true })`.

## Troubleshooting
- CORS: If frontend runs on a different localhost port (5173/5174), ensure backend CORS allows that origin.
- MongoDB errors: Check `MONGODB_URI` and network access (Atlas IP whitelist or local DB running).
- Cookies not set: ensure `withCredentials:true` on frontend requests and `sameSite` cookie option set appropriately (we use `lax` for dev).
- Gemini failures: check `GEMINI_API_URL` and API key validity; backend logs Gemini raw responses.

## Next steps
- See `DOCUMENTATION.md` for architecture, flow diagrams, and deeper guidance on how to modify behavior.
