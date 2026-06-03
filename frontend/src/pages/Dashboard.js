import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { URLForm } from '../components/urls/URLForm';
import { URLList } from '../components/urls/URLList';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('urls');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchURLs(true);
    const intervalId = setInterval(() => fetchURLs(false), 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  const fetchURLs = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get('/urls');
      setUrls(response.data.urls || []);
      setError('');
    } catch (err) {
      setError('Failed to load URLs. Please try again.');
      console.error('Fetch URLs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleURLCreated = (newURL) => {
    setUrls([newURL, ...urls]);
    setSuccess('URL shortened successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleURLDeleted = async (id) => {
    try {
      await api.delete(`/urls/${id}`);
      setUrls(urls.filter((url) => url._id !== id));
    } catch (err) {
      setError('Failed to delete URL.');
      console.error('Delete URL error:', err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your shortened URLs and view analytics</p>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-md mb-6 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('urls')}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'urls'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
              }`}
            >
              My URLs
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
              }`}
            >
              Analytics Overview
            </button>
          </nav>

          <div className="mt-8 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Quick Stats</h3>
            <div className="space-y-6">
              <div>
                <p className="text-3xl font-light tracking-tight text-indigo-600 dark:text-indigo-400">{urls.length}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total URLs</p>
              </div>
              <div>
                <p className="text-3xl font-light tracking-tight text-slate-700 dark:text-slate-200">
                  {urls.reduce((sum, url) => sum + (url.analytics?.clickCount || 0), 0)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Clicks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-grow min-w-0">
          {activeTab === 'urls' && (
            <div className="space-y-8">
              <URLForm onURLCreated={handleURLCreated} />
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                </div>
              ) : (
                <URLList urls={urls} onURLDeleted={handleURLDeleted} />
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analytics Overview</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Select a URL from the list below to view detailed analytics charts and traffic sources.</p>
              </div>
              {loading && urls.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                </div>
              ) : (
                <URLList urls={urls} onURLDeleted={handleURLDeleted} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
