# BotSpoof

A fast, responsive full-stack AI chatbot web application built with React and powered by the Groq API.

🔗 **Live Demo:** [https://botspoof-seven.vercel.app](https://botspoof-seven.vercel.app)

---

## Overview

BotSpoof is an intelligent conversational AI assistant featuring real-time stream responses, modern dark-mode styling, markdown and syntax-highlighted code blocks, and flexible guest or authenticated user sessions.

---

## Key Features

- **Instant AI Responses**: High-speed conversational AI powered by Groq.
- **Guest & User Modes**: One-click instant guest access or secure email account signup.
- **Modern UI**: Polished dark theme interface with complete mobile responsiveness.
- **Resilient Architecture**: Supports offline operation or full MongoDB message history persistence.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI Integration**: Groq API
- **Authentication**: JWT & Secure Cookies
- **Hosting**: Vercel

---

## Local Setup

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=qwen/qwen3.8-27b
JWT_SECRET=your_jwt_secret
```

### 3. Run the App
```bash
# Start development server
npm run dev

# Or build and run for production
npm run build
npm start
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Author

**Abhishek Yadav**  
GitHub: [@yadavabhishek07](https://github.com/yadavabhishek07)
