import { useState, useEffect, useCallback, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { User } from '@/types/user';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import { UserTable } from '@/components/UserTable';

interface UsersPageProps {
  users: User[];
  error?: string;
  initialSearch?: string;
}

export default function UsersPage({ users, error, initialSearch = '' }: UsersPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // Track if update is from URL change to prevent loops
  const isProcessingURLUpdate = useRef(false);
  
  // Effect to update from URL when query changes
  useEffect(() => {
    if (router.isReady && router.query.search !== undefined && !isProcessingURLUpdate.current) {
      const searchFromURL = router.query.search ? String(router.query.search) : '';
      if (searchFromURL !== searchTerm) {
        setSearchTerm(searchFromURL);
        setDebouncedSearchTerm(searchFromURL);
      }
    }
  }, [router.isReady, router.query.search, searchTerm]);
  
  // Update URL with search parameter to make it shareable and bookmarkable
  // Use debounce to prevent too many history entries and API calls
  const updateSearchParams = useCallback(
    debounce((search: string) => {
      // Prevent circular updates - skip if term is already in URL
      if (router.query.search === search || 
         (search === '' && !router.query.search)) {
        setDebouncedSearchTerm(search);
        return;
      }
      
      isProcessingURLUpdate.current = true;
      const url = {
        pathname: router.pathname,
        query: { ...(search ? { search } : {}) }
      };
      router.push(url, undefined, { shallow: true })
        .then(() => {
          setDebouncedSearchTerm(search);
          setTimeout(() => {
            isProcessingURLUpdate.current = false;
          }, 100);
        });
    }, 300),
    [router]
  );

  // Effect to update URL when search changes
  useEffect(() => {
    if (!isProcessingURLUpdate.current) {
      updateSearchParams(searchTerm);
    }
  }, [searchTerm, updateSearchParams]);

  // Prefetch detail pages for the first 5 users when component mounts
  useEffect(() => {
    if (users && users.length > 0) {
      const prefetchCount = Math.min(users.length, 5);
      for (let i = 0; i < prefetchCount; i++) {
        router.prefetch(`/users/${users[i].id}`);
      }
    }
  }, [users, router]);
  
  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md px-4 py-10 bg-white rounded-xl shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Failed to Load Users</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/users" className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-500 transition-colors shadow-sm">
            Try Again
          </Link>
        </div>
      </div>
    );
  }
  
  // Handle loading state
  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center py-12 px-4 bg-white rounded-xl shadow-md">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    user.company.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>User Directory | Browse Users</title>
        <meta name="description" content="Browse all users" />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Users Directory</h1>
              <p className="text-gray-600">Browse and search for users in our database.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-medium">{filteredUsers.length} Users</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-blue-50">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by name, email or company..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search users"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        
          {filteredUsers.length > 0 ? (
            <UserTable users={filteredUsers} />
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { search } = context.query;
  const initialSearch = search ? String(search) : '';
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      return {
        props: {
          users: [],
          error: `Failed to fetch users: ${response.status} ${response.statusText}`,
          initialSearch
        },
      };
    }
    
    const users: User[] = await response.json();

    return {
      props: {
        users,
        initialSearch
      },
    };
  } catch (error) {
    return {
      props: {
        users: [],
        error: 'An error occurred while fetching users. Please try again.',
        initialSearch
      },
    };
  }
}; 