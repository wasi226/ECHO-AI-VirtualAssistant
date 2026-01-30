# Virtual Assistant - Voice-Enabled AI Assistant

A full-stack web application that provides a voice-controlled AI assistant powered by Google Gemini. Users can register, customize their assistant (name & avatar), and interact using voice commands.

## 🎯 Features

- **Voice Recognition & Synthesis** — Speech-to-text input and text-to-speech output
- **AI-Powered Responses** — Integrates Google Gemini LLM for natural language understanding
- **User Authentication** — JWT-based auth with MongoDB persistence
- **Assistant Customization** — Choose avatar image and name
- **Multi-Intent Support** — Handles searches (Google/YouTube), time/date queries, calculator, social media, weather
- **Command History** — Tracks all user commands

## 📁 Project Structure

```
virtualAssistant/
├── Backend/
│   ├── controllers/       # Auth & user logic
│   ├── middlewares/       # JWT auth, file upload
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── config/            # Database & Cloudinary
│   ├── gemini.js          # LLM integration
│   ├── index.js           # Express app
│   ├── package.json
│   ├── README.md
│   └── DOCUMENTATION.md   # Detailed backend docs
├── Frontend/
│   ├── src/
│   │   ├── pages/         # SignIn, SignUp, Home, Customize
│   │   ├── components/    # Reusable components
│   │   ├── context/       # UserContext (state management)
│   │   ├── assets/        # Images & GIFs
│   │   └── App.jsx        # Main router
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/virtualAssistant
JWT_SECRET=your-secret-key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_GEMINI_KEY
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start backend:
```bash
npm run dev
```
Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` or `http://localhost:5174`

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register user |
| POST | `/api/auth/signin` | ❌ | Login user |
| GET | `/api/auth/logout` | ✅ | Logout user |
| GET | `/api/user/current` | ✅ | Get user profile |
| POST | `/api/user/update` | ✅ | Update assistant name/image |
| POST | `/api/user/asktoassistant` | ✅ | Send command to Gemini |

## 🎤 How It Works

1. **User speaks** a command containing their assistant's name (e.g., "Raman, what's the weather?")
2. **Speech Recognition API** captures and converts audio to text
3. **Frontend detects** the assistant name in the transcript
4. **Backend receives** the command and forwards to Gemini
5. **Gemini responds** with structured JSON: `{type, userInput, response}`
6. **Frontend processes** the intent (opens URLs, speaks response, etc.)
7. **Voice Synthesis** reads the response aloud

## 🐛 Troubleshooting

### CORS Errors
- Frontend on 5173/5174? Backend CORS is configured for both ports

### MongoDB Connection Failed
- Check MongoDB Atlas IP whitelist
- Or use local MongoDB: `MONGODB_URI=mongodb://127.0.0.1:27017/virtualAssistant`

### Cookies Not Being Set
- Ensure `withCredentials: true` in axios requests
- Browser must allow third-party cookies

### Gemini API Not Responding
- Verify API key in `.env`
- Check backend logs for raw Gemini response

## 📚 Documentation

- See [Backend/DOCUMENTATION.md](Backend/DOCUMENTATION.md) for detailed architecture and API flow
- See [Backend/README.md](Backend/README.md) for backend-specific setup

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini API

**Frontend:**
- React + Vite
- Tailwind CSS
- Web Speech API
- Axios

## 👤 Author

Created by Wasi Haider

## 📄 License

MIT
