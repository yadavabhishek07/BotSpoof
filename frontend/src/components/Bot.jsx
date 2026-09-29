import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from './ThemeContext.jsx';
import heroLogo from '../assets/hero.png';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);
const IconBot = () => (
  <img src={heroLogo} alt="Bot logo" className="w-full h-full object-contain" />
);
const IconCopy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconNewChat = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// ─── Copy Button ──────────────────────────────────────────────────────────────
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10"
    >
      {copied ? <><IconCheck /><span>Copied</span></> : <><IconCopy /><span>Copy</span></>}
    </button>
  );
};

// ─── Code Block ───────────────────────────────────────────────────────────────
const CodeBlock = ({ children, className }) => {
  const lang = (className || '').replace('language-', '') || 'code';
  const code = String(children).replace(/\n$/, '');
  return (
    <div className="relative group/code my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/10">
        <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto bg-[#f8f8f8] dark:bg-[#111111] p-4 text-sm font-mono leading-relaxed">
        <code className="!text-slate-800 !dark:text-slate-200">{code}</code>
      </pre>
    </div>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ text, sender, isError }) => {
  const isUser = sender === 'user';

  if (isUser) {
    return (
      <div className="flex w-full justify-end animate-fade-in-up mb-6 px-2 sm:px-0">
        <div className="max-w-[88%] sm:max-w-[75%] md:max-w-[65%] px-4 sm:px-5 py-3 rounded-2xl rounded-br-sm bg-slate-100 dark:bg-[#2f2f2f] text-slate-900 dark:text-slate-100 break-words">
          <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{text}</div>
        </div>
      </div>
    );
  }

  // Bot Message
  return (
    <div className="flex w-full justify-start animate-fade-in-up mb-6 group px-2 sm:px-0">
      <div className="flex gap-3 sm:gap-4 w-full max-w-[92%] sm:max-w-[85%] md:max-w-[80%]">
        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center mt-1 shadow-sm overflow-hidden p-0.5">
          <IconBot />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 mb-1.5 ${isError ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
            <span className="text-xs font-semibold">BotSpoof</span>
            {!isError && (
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                🤖 BotSpoof AI
              </span>
            )}
          </div>
          <div className={`prose prose-sm sm:prose-base max-w-none leading-relaxed
            dark:prose-invert
            prose-p:text-slate-800 dark:prose-p:text-slate-200 prose-p:my-1.5
            prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
            prose-ul:my-2 prose-li:my-0.5 prose-li:text-slate-800 dark:prose-li:text-slate-200
            prose-ol:my-2
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-emerald-400 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
            prose-table:text-sm prose-th:bg-slate-100 dark:prose-th:bg-white/10 prose-th:p-2 prose-td:p-2
            ${isError ? 'text-red-600 dark:text-red-400' : ''}
          `}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  if (inline) {
                    return (
                      <code className="bg-slate-100 dark:bg-white/10 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{children}</CodeBlock>;
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-white/10">
                      <table className="min-w-full border-collapse">{children}</table>
                    </div>
                  );
                }
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
          {!isError && text && (
            <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={text} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex w-full justify-start animate-fade-in-up mb-6 px-2 sm:px-0">
    <div className="flex gap-3 sm:gap-4">
      <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center mt-1 shadow-sm overflow-hidden p-0.5">
        <IconBot />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-[#2f2f2f]">
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"></span>
      </div>
    </div>
  </div>
);

// ─── Suggestion Chips ─────────────────────────────────────────────────────────
const suggestions = [
  { icon: '🌍', text: "What's the latest news today?" },
  { icon: '💡', text: "Explain quantum computing in simple terms" },
  { icon: '🖥️', text: "Write a Python web scraper with requests" },
  { icon: '🤖', text: "What is the current price of Bitcoin?" },
];

// ─── Chat Input ───────────────────────────────────────────────────────────────
const ChatInput = ({ input, setInput, handleSendMessage, loading }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full relative z-20 shrink-0 bg-white dark:bg-[#212121] pb-safe pb-4 sm:pb-6 pt-2">
      {/* Fade gradient above */}
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#212121] to-transparent pointer-events-none" />
      <div className="container mx-auto max-w-3xl px-3 sm:px-4">
        <div className="relative flex items-end bg-white dark:bg-[#2f2f2f] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm pl-4 pr-2 py-2 focus-within:border-emerald-400/60 dark:focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Shift+Enter for new line)"
            className="flex-1 max-h-[200px] bg-transparent border-0 py-2 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 resize-none"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-white/10 text-white disabled:text-slate-400 dark:disabled:text-slate-600 rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed mb-1 ml-2 shadow-sm"
          >
            <IconSend />
          </button>
        </div>
        <p className="text-center mt-2 text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
          BotSpoof uses Google Search for real-time data · <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-[10px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-[10px]">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

// ─── Main Bot Component ───────────────────────────────────────────────────────
const Bot = ({ setAuth }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState(localStorage.getItem('groq_api_key') || '');
  const [geminiKeyInput, setGeminiKeyInput] = useState(localStorage.getItem('gemini_api_key') || '');

  const handleSaveSettings = () => {
    localStorage.setItem('groq_api_key', groqKeyInput.trim());
    localStorage.setItem('gemini_api_key', geminiKeyInput.trim());
    setIsSettingsOpen(false);
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/bot/v1/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const history = await response.json();
          const formatted = history.map(msg => ({
            id: msg._id || msg.timestamp,
            sender: msg.sender,
            text: msg.text
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    const userMsg = { sender: 'user', text: messageText, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const botMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { id: botMsgId, sender: 'bot', text: '', isStreaming: true }]);

    try {
      const token = localStorage.getItem('token');
      const groqKey = localStorage.getItem('groq_api_key') || '';
      const geminiKey = localStorage.getItem('gemini_api_key') || '';

      const response = await fetch('/bot/v1/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Groq-API-Key': groqKey,
          'X-Gemini-API-Key': geminiKey
        },
        body: JSON.stringify({ text: messageText })
      });

      if (!response.ok) {
        if (response.status === 401) { handleSignOut(); return; }
        let errMsg = `Server error (${response.status})`;
        try { const d = await response.json(); if (d.error) errMsg = d.error; } catch {}
        throw new Error(errMsg);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let botText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events end with \n\n — extract complete events only
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? ''; // keep incomplete tail for next chunk

        for (const part of parts) {
          // Each part may contain multiple "data: ..." lines; grab the last data line
          const dataLine = part.split('\n').reverse().find(l => l.startsWith('data: '));
          if (!dataLine) continue;

          const data = dataLine.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              botText += parsed.content;
              setMessages(prev => prev.map(msg =>
                msg.id === botMsgId ? { ...msg, text: botText } : msg
              ));
            } else if (parsed.error) {
              // Append error below any existing content rather than replacing it
              const separator = botText ? '\n\n---\n' : '';
              botText += separator + parsed.error;
              setMessages(prev => prev.map(msg =>
                msg.id === botMsgId ? { ...msg, text: botText, isError: !botText.replace(separator + parsed.error, '').trim() } : msg
              ));
            }
          } catch {
            // ignore JSON parse errors
          }
        }
      }

      setMessages(prev => prev.map(msg =>
        msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
      ));
    } catch (error) {
      console.error('Chat error:', error);
      const errText = error.message || 'Something went wrong. Please try again.';
      // Only replace content if nothing was streamed yet
      setMessages(prev => prev.map(msg => {
        if (msg.id !== botMsgId) return msg;
        const hasContent = msg.text && msg.text.trim().length > 0;
        return {
          ...msg,
          text: hasContent ? msg.text + '\n\n---\n' + errText : errText,
          isError: !hasContent,
          isStreaming: false
        };
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setAuth(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  const userMsgs = messages.filter(m => m.sender === 'user').slice().reverse();

  return (
    <div className="flex h-[100dvh] w-full relative bg-white dark:bg-[#212121] overflow-hidden font-sans text-slate-900 dark:text-slate-100">

      {/* ── Sidebar ── */}
      <>
        {/* Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <aside className={`
          fixed md:relative top-0 left-0 z-30 h-full
          w-[280px] sm:w-[300px]
          bg-[#f9f9f9] dark:bg-[#171717]
          border-r border-slate-200 dark:border-white/5
          flex flex-col
          transition-transform duration-300 ease-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm overflow-hidden p-0.5">
                <IconBot />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">BotSpoof</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 font-medium">🤖 Local AI · Free &amp; Private</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500"
            >
              ✕
            </button>
          </div>

          {/* New Chat */}
          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl border border-dashed border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <IconNewChat />
              New chat
            </button>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto px-3 py-1">
            {userMsgs.length > 0 ? (
              <>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">Recent</p>
                <div className="space-y-0.5">
                  {userMsgs.map((msg, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      title={msg.text}
                    >
                      <IconSearch />
                      <span className="truncate flex-1">{msg.text}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">
                No history yet
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-white/5 space-y-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {theme === 'light' ? <IconMoon /> : <IconSun />}
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <IconSettings />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <IconLogout />
              Sign out
            </button>
            <div className="text-center pt-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Created by Abhishek
            </div>
          </div>
        </aside>
      </>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#212121]/80 backdrop-blur-sm shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <IconMenu />
          </button>
          <div className="flex items-center gap-2 md:ml-0 ml-2">
            <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden p-0.5">
              <IconBot />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">BotSpoof</span>
            <span className="hidden sm:flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              🦙 Local AI · Free
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {theme === 'light' ? <IconMoon /> : <IconSun />}
          </button>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-10 animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/25 overflow-hidden p-1.5">
                <img src={heroLogo} alt="Welcome Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">How can I help you?</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 max-w-sm">
                Powered by <strong className="text-emerald-600 dark:text-emerald-400">Local AI</strong> running on your machine — 100% free, no limits, no API keys.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-medium">
                Created by Abhishek
              </p>

              {/* Suggestion chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s.text)}
                    className="flex items-center gap-3 p-3 sm:p-4 text-left rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 text-sm text-slate-700 dark:text-slate-300 group"
                  >
                    <span className="text-xl shrink-0">{s.icon}</span>
                    <span className="leading-snug">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pt-6 pb-2">
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id || idx}
                  text={msg.text}
                  sender={msg.sender}
                  isError={msg.isError}
                />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          loading={loading}
        />
      </div>

      {/* ── Settings Modal ── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up text-slate-900 dark:text-slate-100">
            <h3 className="text-lg font-bold mb-4">API Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your own API keys. They are stored securely in your browser's local storage and used directly from your device.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Groq API Key (Recommended)
                </label>
                <input
                  type="password"
                  value={groqKeyInput}
                  onChange={(e) => setGroqKeyInput(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#2a2a2a] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#2a2a2a] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bot;