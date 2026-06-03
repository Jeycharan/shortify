import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { QRCodeSVG } from 'qrcode.react';
import { BACKEND_ORIGIN } from '../config/urls';
import { ConfirmModal } from '../components/ui/ConfirmModal';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export function URLDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    originalUrl: '',
    title: '',
    description: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(() => fetchData(false), 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(intervalId);
  }, [id]);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [urlResponse, analyticsResponse, visitsResponse] =
        await Promise.all([
          api.get(`/urls/${id}`),
          api.get(`/analytics/${id}`),
          api.get(`/analytics/${id}/visits`),
        ]);
      const urlData = urlResponse.data.url;
      setUrl(urlData);
      setEditForm({
        originalUrl: urlData.originalUrl,
        title: urlData.title || '',
        description: urlData.description || '',
      });
      setAnalytics(analyticsResponse.data.analytics);
      setVisits(visitsResponse.data.visits);
      setError('');
    } catch (err) {
      setError('Failed to load URL details. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/urls/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete URL. Please try again.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const response = await api.put(`/urls/${id}`, editForm);
      setUrl(response.data.url);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update URL');
    } finally {
      setEditSaving(false);
    }
  };

  const copyToClipboard = () => {
    const shortUrl = `${BACKEND_ORIGIN}/${url?.customAlias || url?.shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    alert('Short URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-7xl mx-auto py-8'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm'>
          {error}
        </div>
        <Link
          to='/dashboard'
          className='text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block text-sm'
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!url) {
    return (
      <div className='max-w-7xl mx-auto py-8'>
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 text-yellow-600 dark:text-yellow-400 px-4 py-3 rounded-md text-sm'>
          URL not found.
        </div>
        <Link
          to='/dashboard'
          className='text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block text-sm'
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <Link
          to='/dashboard'
          className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center text-sm font-medium transition-colors w-fit'
        >
          <svg
            className='w-4 h-4 mr-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className='space-y-6'>
        {/* URL Info Card */}
        <div className='bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-6 w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-w-0'>
            <div className='md:col-span-2 min-w-0'>
              <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1'>
                Title
              </p>
              <p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
                {url.title || url.customAlias || 'Untitled'}
              </p>
            </div>
            <div className='md:col-span-3 min-w-0'>
              <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1'>
                Destination
              </p>
              <div className='flex items-center text-sm font-medium text-slate-900 dark:text-white truncate'>
                <svg
                  className='w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
                  />
                </svg>
                <span className='truncate' title={url.originalUrl}>
                  {url.originalUrl}
                </span>
              </div>
            </div>
            <div className='md:col-span-3 min-w-0'>
              <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1'>
                Short URL
              </p>
              <div className='flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 min-w-0'>
                <svg
                  className='w-4 h-4 mr-2 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                  />
                </svg>
                <span className='truncate' title={`${BACKEND_ORIGIN}/${url.customAlias || url.shortCode}`}>
                  {BACKEND_ORIGIN}/{url.customAlias || url.shortCode}
                </span>
              </div>
            </div>
            <div className='md:col-span-2 min-w-0'>
              <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1'>
                Created
              </p>
              <div className='flex items-center text-sm font-medium text-slate-900 dark:text-white'>
                <svg
                  className='w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                {new Date(url.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className='md:col-span-2 min-w-0'>
              <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1'>
                Expires
              </p>
              <div className='flex items-center text-sm font-medium text-slate-900 dark:text-white'>
                <svg
                  className='w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                {url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-3 flex-shrink-0'>
            <button
              onClick={copyToClipboard}
              className='px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center transition-colors shadow-sm'
            >
              <svg
                className='w-4 h-4 mr-2 text-slate-400 dark:text-slate-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
                />
              </svg>
              Copy
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center transition-colors shadow-sm'
            >
              <svg
                className='w-4 h-4 mr-2 text-slate-400 dark:text-slate-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className='px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/30 flex items-center transition-colors shadow-sm'
            >
              <svg
                className='w-4 h-4 mr-2 text-red-500 dark:text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
              Delete
            </button>
          </div>
        </div>

        {isEditing && (
          <div className='bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-6 w-full'>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-6'>
              Edit URL
            </h3>
            <form onSubmit={handleEditSubmit} className='space-y-5'>
              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
                  Original URL
                </label>
                <input
                  type='url'
                  required
                  value={editForm.originalUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, originalUrl: e.target.value })
                  }
                  className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm'
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
                    Title
                  </label>
                  <input
                    type='text'
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
                    Description
                  </label>
                  <input
                    type='text'
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm'
                  />
                </div>
              </div>
              <div className='flex space-x-3 pt-4'>
                <button
                  type='submit'
                  disabled={editSaving}
                  className='px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-colors'
                >
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md shadow-sm transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-6'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center'>
                <div className='w-1.5 h-6 bg-indigo-500 rounded-full mr-3'></div>
                <h3 className='text-xl font-light tracking-tight text-slate-900 dark:text-white'>
                  {analytics?.clickCount || 0}{' '}
                  <span className='text-sm font-medium text-slate-500 dark:text-slate-400 ml-1'>
                    Total Clicks
                  </span>
                </h3>
              </div>
              <div className='flex space-x-2 hidden sm:flex'>
                <button className='px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'>
                  This month
                </button>
                <button className='px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-md'>
                  All time
                </button>
                <button className='px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'>
                  Last 7 days
                </button>
              </div>
            </div>
            <div className='h-64'>
              <Bar
                data={{
                  labels: analytics?.dailyClicks?.map((d) => d.date) || [],
                  datasets: [
                    {
                      data: analytics?.dailyClicks?.map((d) => d.count) || [],
                      backgroundColor: '#6366f1', // indigo-500
                      borderRadius: 4,
                      barThickness: 24,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: '#94a3b8' },
                    },
                    y: {
                      border: { display: false },
                      grid: { color: '#e2e8f0', drawBorder: false },
                      ticks: { color: '#94a3b8', stepSize: 1 },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className='lg:col-span-1 space-y-6'>
            <div className='bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-6'>
              <div className='flex items-center mb-6'>
                <div className='w-1.5 h-6 bg-indigo-500 rounded-full mr-3'></div>
                <h3 className='text-base font-semibold text-slate-900 dark:text-white'>
                  Top Referrers
                </h3>
              </div>
              <div className='space-y-4'>
                {Object.entries(analytics?.referrerBreakdown || {}).map(
                  ([referrer, count]) => (
                    <div
                      key={referrer}
                      className='flex justify-between items-center text-sm'
                    >
                      <span className='text-slate-600 dark:text-slate-300 font-medium truncate'>
                        {referrer}
                      </span>
                      <span className='text-slate-900 dark:text-white font-semibold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md'>
                        {count}
                      </span>
                    </div>
                  ),
                )}
                {Object.keys(analytics?.referrerBreakdown || {}).length ===
                  0 && (
                  <p className='text-sm text-slate-500 dark:text-slate-400'>
                    No data available.
                  </p>
                )}
              </div>
            </div>

            <div className='bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col items-center justify-center'>
              <div className='bg-white p-2 rounded-lg mb-4'>
                <QRCodeSVG
                  value={`${BACKEND_ORIGIN}/${url.customAlias || url.shortCode}`}
                  size={140}
                />
              </div>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Scan to visit URL
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Short URL"
        message="Are you sure you want to delete this short URL? This action cannot be undone and the link will stop working immediately."
      />
    </div>
  );
}
