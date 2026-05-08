'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl -z-10 opacity-20" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200 rounded-full blur-3xl -z-10 opacity-20" />

      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-4xl w-full z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900">
          Find Your Next <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dream Career
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          The next-generation job portal designed to connect top talent with world-class opportunities. Experience a seamless hiring journey powered by microservices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
          {isAuthenticated ? (
            <>
              <Link
                href="/jobs"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Browse Jobs
              </Link>
              {user?.role === 'EMPLOYER' && (
                <Link
                  href="/jobs/create"
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Post a Job
                </Link>
              )}
              {user?.role === 'JOB_SEEKER' && (
                <Link
                  href="/applications"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  My Applications
                </Link>
              )}
              <Link
                href="/profile"
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/jobs"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Browse Jobs
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-gray-200 pt-10">
          {[
            { label: 'Active Jobs', value: '1000+' },
            { label: 'Companies', value: '100+' },
            { label: 'Job Seekers', value: '5000+' },
            { label: 'New Daily', value: '50+' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-sm text-gray-600 mt-2 uppercase tracking-wider font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
