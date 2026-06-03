import React from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config/urls';

export function URLList({ urls, onURLDeleted }) {
  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this URL?')) {
      onURLDeleted(id);
    }
  };

  const copyToClipboard = (text, e) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (urls.length === 0) {
    return (
      <div className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm p-12 text-center'>
        <div className='w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-md flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-600'>
          <svg
            className='w-6 h-6 text-slate-400 dark:text-slate-500'
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
        </div>
        <h3 className='text-base font-medium text-slate-900 dark:text-slate-100'>
          No URLs yet
        </h3>
        <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
          Create your first short URL to get started.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full table-fixed divide-y divide-slate-200 dark:divide-slate-700'>
          <thead className='bg-slate-50 dark:bg-slate-800/50'>
            <tr>
              <th className='w-[35%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Short URL
              </th>
              <th className='w-[30%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Original URL
              </th>
              <th className='w-[15%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Created
              </th>
              <th className='w-[8%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Clicks
              </th>
              <th className='w-[12%] px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700'>
            {urls.map((url) => (
              <tr
                key={url._id}
                className='hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'
              >
                <td className='px-4 sm:px-6 py-4'>
                  <div className='flex flex-col w-full'>
                    <a
                      href={`${BACKEND_ORIGIN}/${url.customAlias || url.shortCode}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-indigo-600 dark:text-indigo-400 font-mono text-sm hover:underline block truncate w-full'
                      title={`${BACKEND_ORIGIN}/${url.customAlias || url.shortCode}`}
                    >
                      {BACKEND_ORIGIN}/{url.customAlias || url.shortCode}
                    </a>
                  </div>
                </td>
                <td className='px-4 sm:px-6 py-4'>
                  <div
                    className='text-sm text-slate-900 dark:text-slate-300 block truncate w-full'
                    title={url.originalUrl}
                  >
                    {url.originalUrl}
                  </div>
                </td>
                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400'>
                  {new Date(url.createdAt).toLocaleDateString()}
                </td>
                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm'>
                  <span className='px-2.5 py-0.5 inline-flex text-xs font-medium rounded-md bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                    {url.analytics?.clickCount || 0}
                  </span>
                </td>
                <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex items-center justify-end space-x-3'>
                    <Link
                      to={`/urls/${url._id}`}
                      className='text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors'
                      title='View Analytics'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={(e) =>
                        copyToClipboard(
                          `${BACKEND_ORIGIN}/${url.customAlias || url.shortCode}`,
                          e,
                        )
                      }
                      className='text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors'
                      title='Copy URL'
                    >
                      <svg
                        className='w-5 h-5'
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
                    </button>
                    <button
                      onClick={(e) => handleDelete(url._id, e)}
                      className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors'
                      title='Delete'
                    >
                      <svg
                        className='w-5 h-5'
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
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
