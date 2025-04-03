import React, { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export const Layout = ({ children, title = 'User Listing App', description = 'Browse and manage user data' }: LayoutProps) => {
  const router = useRouter();
  
  // Prefetch important routes when component mounts
  useEffect(() => {
    // Prefetch main routes for instant navigation
    router.prefetch('/');
    router.prefetch('/users');
  }, [router]);
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6"></div>
                <span className="text-xl font-bold text-gray-800">User Directory</span>
              </Link>
              <nav>
                <ul className="flex space-x-8">
                  <li>
                    <Link href="/" prefetch={true} className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${router.pathname === '/' ? 'text-blue-600' : ''}`}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/users" prefetch={true} className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${router.pathname === '/users' || router.pathname.startsWith('/users/') ? 'text-blue-600' : ''}`}>
                      Users
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-grow bg-slate-50 py-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-blue-600 text-white rounded-full w-4 h-4"></div>
                  <span className="font-semibold text-gray-700">User Directory</span>
                </div>
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} User Directory App. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="https://github.com/hecdeveloper/my-user-app" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}; 