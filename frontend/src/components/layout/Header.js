import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className='sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm'>
                <span className='text-white font-bold text-lg'>S</span>
              </div>
              <span className='text-xl font-semibold text-slate-900 dark:text-slate-100'>
                Shortify
              </span>
            </Link>
            <Link
              to='/'
              className={`ml-1 p-2 rounded-md transition-colors text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800`}
              aria-label='Home'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
            </Link>
          </div>
          <div className='flex items-center space-x-2 sm:space-x-4'>
            <button
              onClick={toggleTheme}
              title={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className='p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              {isDarkMode ? (
                <svg
                  className='w-5 h-5 text-yellow-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM10 16a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM4.22 4.22a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM13.84 13.84a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75H4a.75.75 0 010 1.5H2.75A.75.75 0 012 10zM16 10a.75.75 0 01.75-.75H18a.75.75 0 010 1.5h-1.25A.75.75 0 0116 10zM4.22 15.78a.75.75 0 010-1.06l.88-.88a.75.75 0 111.06 1.06l-.88.88a.75.75 0 01-1.06 0zM13.84 6.16a.75.75 0 010-1.06l.88-.88a.75.75 0 111.06 1.06l-.88.88a.75.75 0 01-1.06 0zM10 6.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z' />
                </svg>
              ) : (
                <svg
                  className='w-5 h-5 text-slate-700 dark:text-slate-200'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'
                  />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to='/dashboard'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </Link>
                <div className='flex items-center space-x-1 sm:space-x-3'>
                  <span className='hidden sm:inline-block text-sm text-slate-500 dark:text-slate-400'>
                    {user?.username || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className='px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-colors'
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/login'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='px-3 sm:px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm whitespace-nowrap'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className='bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center text-slate-500 dark:text-slate-400 text-sm'>
          <p>© 2026 Shortify. All rights reserved.</p>
          <p className='mt-2'>
            This project is a part of a hackathon run by{' '}
            <a
              href='https://katomaran.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-indigo-600 dark:text-indigo-400 hover:underline'
            >
              https://katomaran.com
            </a>
          </p>

          <div className='mt-4 flex items-center justify-center space-x-4'>
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 4.99 3.66 9.12 8.44 9.93v-7.04H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.9h-2.3v7.04C18.34 21.19 22 17.06 22 12.07z' />
              </svg>
            </a>

            <a
              href='https://youtube.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='YouTube'
              className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors'
            >
              <svg
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='currentColor'
                aria-hidden='true'
              >
                <path d='M23.5 6.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1-2.9-.2-7.3-.2-7.3-.2h-.1s-4.4 0-7.3.2c-.4.1-1.3.1-2.1 1C.7 4.6.5 6.2.5 6.2S.2 8 .2 9.9v1.9c0 1.9.3 3.7.3 3.7s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.1 7.3.2 7.3.2s4.4 0 7.3-.2c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.3-1.8.3-3.7V9.9c0-1.9-.3-3.7-.3-3.7zM9.99 15.6V8.4l6.07 3.6-6.07 3.6z' />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
