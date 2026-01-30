Virtual Assistant — Backend Documentation

1. Project Overview
-------------------
This backend provides authentication, user persistence, assistant customization, and an API gateway to a generative LLM (Gemini). The voice assistant flow is primarily handled by the frontend (speech recognition + synthesis). The backend receives natural language commands from the frontend, forwards them to the LLM, parses the LLM response (expects a JSON object embedded in text), and returns a concise intent + response.

2. Folder structure (key files)
-------------------------------
- `index.js` — app bootstrap, CORS, cookie parser, router mounting
- `controllers/auth.controllers.js` — signup, signin, logout
- `controllers/user.controllers.js` — get current user, update assistant, askToAssistant
- `models/user.model.js` — Mongoose User schema
- `middlewares/isAuth.js` — verifies JWT cookie and sets `req.userId`
- `gemini.js` — helper that calls Gemini API and returns raw text
- `config/db.js` — MongoDB connection helper
- `.env` — environment variables

3. Authentication
-----------------
- Users sign up via `POST /api/auth/signup` (body: `{name,email,password}`)
- On signup/signin the backend generates a JWT and sets a cookie named `token` (httpOnly, `sameSite=lax` for dev)
- `isAuth` middleware checks `req.cookies.token` and populates `req.userId`

4. User model & customization
-----------------------------
User schema fields:
- `name`, `email`, `password` (hashed), `assistantName`, `assistantImage`, `history`

Customization flow (frontend):
1. User selects an image and assistant name in the UI
2. Frontend calls `POST /api/user/update` (authenticated) with `assistantName` and `imagesUrl` (string)
3. Backend stores `assistantName` and `assistantImage` on the user document

Notes:
- Default images can be handled client-side by sending a static image URL (or a key) to the backend.
- Uploaded images are currently handled via multer + Cloudinary (if enabled); saved value ends up in `assistantImage`.

5. askToAssistant flow (LLM integration)
---------------------------------------
- Endpoint: `POST /api/user/asktoassistant` (body: `{command}`) — requires `isAuth`
- Backend appends the command to user's `history` and calls `geminiResponse(command, assistantName, userName)`
- `geminiResponse` sends a prompt instructing Gemini to reply with a JSON object like:
  ```json
  { "type": "<intent>", "userInput": "<cleaned input>", "response": "<spoken response>" }
  ```
- Backend extracts a JSON substring from the raw Gemini text response using a regex: `/{[\s\S]*}/`
- The backend parses the JSON and maps `type` to handlers (get-date, get-time, youtube-search, google-search, calculator-open, instagram-open, facebook-open, weather-show, general)
- If successful, backend returns `{type, userInput, response}` to frontend

6. Frontend voice handling notes
--------------------------------
- The frontend performs speech recognition and concatenates all recognition `results` into a full transcript.
- It checks whether the transcript contains the current `assistantName` (case-insensitive). If not present, no command is sent.
- On detecting the assistant name, frontend calls `POST /api/user/asktoassistant` with `{command: transcript}` and expects `{type, userInput, response}`.
- Frontend handles `type` to open URLs (Google, YouTube), handle time/date queries, or speak the `response` using Web Speech API.

7. Common issues & fixes
------------------------
- CORS errors: Ensure `index.js` CORS config includes the exact frontend origin(s). For dev, allow both `http://localhost:5173` and `http://localhost:5174`.
- Cookies / auth: Use `withCredentials: true` in axios calls. Ensure cookie `sameSite` is set to `lax` for local dev to allow cross-site cookies on localhost.
- MongoDB `querySrv ENOTFOUND`: DNS resolution for Atlas failed — either whitelist IPs in Atlas Network Access or use a local MongoDB connection string.
- Gemini: If LLM returns unexpected text or no JSON, backend logs raw Gemini output. Check `GEMINI_API_URL` and API key validity. The prompt must instruct the model strictly to return JSON.

8. How to add/change behavior
-----------------------------
- To add new intent types: update the Gemini prompt in `gemini.js` to describe the new intent, then update `askToAssistant` in `controllers/user.controllers.js` to handle the new `type`.
- To change voice language/voice selection: edit `Home.jsx` `speak()` — it currently uses `hi-IN` as the language; modify as desired.

9. Running tests / manual checks
--------------------------------
- Start backend: `cd Backend && npm run dev`
- Start frontend: `cd Frontend && npm run dev` (monitor which port Vite picks — 5173 or 5174)
- Register a user, customize assistant, then on the Home page open DevTools and say: `"<AssistantName>, what's the weather?"`
- Watch backend logs for `askToAssistant` steps — it logs Gemini raw response and steps for debugging.

10. Useful file references
-------------------------
- Backend app entry: `index.js`
- Auth: `controllers/auth.controllers.js`
- User & assistant logic: `controllers/user.controllers.js`
- Gemini call: `gemini.js`
- Frontend voice logic: `Frontend/src/pages/Home.jsx`
- Frontend context: `Frontend/src/context/UserContext.jsx`

11. Security & production notes
-------------------------------
- Do NOT commit `.env` or secrets. Use proper secret management in production.
- Set cookie `secure: true` and appropriate `sameSite` for production domains.
- Restrict allowed CORS origins and do not use `0.0.0.0/0` in Atlas in production.

---
If you'd like, I can also:
- Add a top-level README that describes both frontend and backend together
- Add quick CI/dev scripts to start both services concurrently
- Create a small Postman collection for the APIs

