import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import heroLogo from '../assets/hero.png';

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    try {
      const res = await axios.post('/api/auth/guest');
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Guest login failed');
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-slate-50 dark:bg-[#171717] transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        {/* Card */}
        <div className="bg-white dark:bg-[#212121] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-emerald-500/25 mb-4 bg-white p-1">
              <img src={heroLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to continue to BotSpoof</p>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-xl mb-5 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                aria-label="Email address"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 dark:focus:ring-emerald-500/30 transition-all text-sm"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 dark:focus:ring-emerald-500/30 transition-all text-sm pr-16"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Guest login */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors duration-200 text-sm"
          >
            Continue as Guest
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            Created by Abhishek
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
