import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Bot from './components/Bot.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Simple JWT expiry check (client-side only)
function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return isTokenValid(token);
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isTokenValid(token)) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/chat" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/chat" replace />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <Bot setAuth={setIsAuthenticated} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;