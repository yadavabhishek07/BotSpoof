import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url' 

import chatbotRoutes from './routes/chatbot.route.js'
import authRoutes from './routes/auth.route.js'
import { offlineUsers } from './utils/authHelpers.js'
import { offlineGuestLogin } from './utils/offlineHandlers.js'


const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

//database connection
let isOffline = false;
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log('Database connected'); })
    .catch((err) => {
      console.log('Database connection error:', err.message);
      isOffline = true;
    });
} else {
  console.log('No MONGO_URI found in environment variables. Running in offline fallback mode.');
  isOffline = true;
}

// Ensure at least one guest user exists if in offline mode
if (isOffline) {
  try {
    const guest = offlineGuestLogin(offlineUsers);
    console.log('Offline guest login initialized:', guest.guestId);
  } catch (e) {
    console.error('Failed to initialize offline guest:', e);
  }
}





// routes

app.use("/bot/v1", chatbotRoutes)
app.use("/api/auth", authRoutes)

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'))
  } else {
    next()
  }
})


if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

export default app;