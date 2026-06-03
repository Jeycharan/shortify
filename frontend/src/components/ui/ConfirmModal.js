import React, { useEffect } from 'react';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity'>
      <div 
        className='bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200'
        role="dialog"
        aria-modal="true"
      >
        <div className='p-6'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4'>
            <svg className='w-6 h-6 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white text-center mb-2'>
            {title}
          </h3>
          <p className='text-sm text-slate-500 dark:text-slate-400 text-center'>
            {message}
          </p>
        </div>
        <div className='bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:space-x-reverse sm:space-x-3 gap-3 sm:gap-0 border-t border-slate-200 dark:border-slate-700'>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className='w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className='w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
