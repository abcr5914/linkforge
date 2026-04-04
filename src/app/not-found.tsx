/**
 * Custom 404 Page
 *
 * Shown when a short code is not found in the database.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full text-center animate-slide-up">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-white mb-2">Link Not Found</h1>
        <p className="text-sm text-gray-400 mb-6">
          This short link doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
