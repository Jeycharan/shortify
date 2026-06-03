import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Go Home
      </Link>
    </div>
  );
}
