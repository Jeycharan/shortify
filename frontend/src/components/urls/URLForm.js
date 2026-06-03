import React, { useState } from 'react';
import api from '../../services/api';

export function URLForm({ onURLCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxClicks, setMaxClicks] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const formData = {
        originalUrl: originalUrl.trim(),
        title: title.trim(),
        description: description.trim(),
        customAlias: customAlias.trim() || undefined,
        expiresAt: expiresAt || undefined,
        maxClicks: maxClicks ? parseInt(maxClicks, 10) : undefined,
      };

      const response = await api.post('/urls', formData);
      setSuccess(true);
      setOriginalUrl('');
      setTitle('');
      setDescription('');
      setCustomAlias('');
      setExpiresAt('');
      setMaxClicks('');

      if (onURLCreated) {
        onURLCreated(response.data.url);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create short URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Create New Short URL</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Long URL <span className="text-red-500">*</span>
          </label>
          <input
            id="originalUrl"
            type="url"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
            placeholder="https://example.com/very/long/url/here"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="My Link"
              maxLength={200}
            />
          </div>
          <div>
            <label htmlFor="customAlias" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Custom Alias <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="customAlias"
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="my-custom-link"
              pattern="[a-zA-Z0-9_-]+"
              title="Only letters, numbers, underscores, and hyphens allowed"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Description <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
            placeholder="Describe your link..."
            rows={2}
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Expiration Date <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="maxClicks" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Max Clicks <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="maxClicks"
              type="number"
              min="1"
              value={maxClicks}
              onChange={(e) => setMaxClicks(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="Unlimited"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm mt-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-md text-sm mt-4">
            URL created successfully!
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </div>
      </form>
    </div>
  );
}
