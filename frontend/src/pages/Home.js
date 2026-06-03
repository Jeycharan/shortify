import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl(null);
    setLoading(true);

    try {
      const response = await api.post('/urls', { 
        originalUrl: url, 
        customAlias: customAlias.trim() || undefined 
      });
      setShortUrl(response.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create short URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <div className="text-center max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          Shorten your URLs <br className="hidden sm:block" />
          <span className="text-indigo-600 dark:text-indigo-400">with precision</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          Create clean, memorable links and track their performance with our
          minimalist analytics dashboard.
        </p>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10 w-full max-w-3xl mx-auto">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL here..."
              className="flex-grow px-4 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="Custom alias (optional)"
              pattern="[a-zA-Z0-9_-]+"
              title="Only letters, numbers, underscores, and hyphens allowed"
              className="w-full sm:w-[22ch] px-4 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
            >
              {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start for Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
            >
              Sign In
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-8 max-w-2xl mx-auto text-sm">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm p-6 mb-12 text-center max-w-2xl mx-auto">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
              Your shortened URL is ready
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`http://localhost:5000/${shortUrl.customAlias || shortUrl.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-medium break-all hover:underline text-lg"
              >
                http://localhost:5000/{shortUrl.customAlias || shortUrl.shortCode}
              </a>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16 border-t border-slate-200 dark:border-slate-800 pt-16">
          <div className="p-2">
            <div className="w-10 h-10 rounded-md flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">Clean Links</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Instantly create short, memorable links that look professional in any context.
            </p>
          </div>

          <div className="p-2">
            <div className="w-10 h-10 rounded-md flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">Quiet Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Track performance with minimal distraction. Everything you need, nothing you don't.
            </p>
          </div>

          <div className="p-2">
            <div className="w-10 h-10 rounded-md flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">Secure Foundation</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Built on a solid, secure architecture to ensure your links always resolve correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
