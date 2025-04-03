import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  console.log('🔍 UsersPage rendering with initialSearch:', initialSearch, 'and users:', users?.length);
  
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  const [showDebug, setShowDebug] = useState(false);
  const [directSearchTerm, setDirectSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Reference to the search input element
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Flag to prevent URL update loops
  const isUpdatingUrl = useRef(false);
  
  // Track when user is actively typing to prevent URL from overriding input
  const isActivelyTyping = useRef(false);
  
  // Separate function to update the URL only - completely separate from state updates
  const updateUrl = useCallback((searchValue: string) => {
    // Skip URL update if already in progress or value already matches
    if (isUpdatingUrl.current || 
        (router.query.search === searchValue || 
        (searchValue === '' && !router.query.search))) {
      return;
    }
    
    console.log('🔄 Setting URL with search term:', searchValue);
    isUpdatingUrl.current = true;
    
    const query = searchValue ? { search: searchValue } : {};
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true })
      .finally(() => {
        // Reset the flag after a short delay to allow state to stabilize
        setTimeout(() => {
          isUpdatingUrl.current = false;
        }, 100);
      });
  }, [router]);
  
  // Handle direct text input changes immediately
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔤 Input changed to:', newValue);
    setSearchTerm(newValue);
    // Mark as actively typing to prevent URL from overriding input
    isActivelyTyping.current = true;
  };
  
  // Debounce search term updates for filtering and URL
  useEffect(() => {
    // Show loading state right away when search term changes
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
    
    const timerId = setTimeout(() => {
      console.log('⏱️ Debounce timer completed for:', searchTerm);
      setDebouncedSearchTerm(searchTerm);
      
      // Only update URL if we're not currently processing a URL change
      if (!isUpdatingUrl.current) {
        updateUrl(searchTerm);
      }
      
      // Reset typing flag after debounce completes
      isActivelyTyping.current = false;
      
      // Hide loading state after search is complete
      setIsSearching(false);
    }, 800); // Longer debounce to ensure typing is complete
    
    return () => clearTimeout(timerId);
  }, [searchTerm, updateUrl, debouncedSearchTerm]);
  
  // Handle URL changes (e.g., when user navigates with browser buttons)
  useEffect(() => {
    if (!router.isReady || isUpdatingUrl.current) return;
    
    const searchFromUrl = typeof router.query.search === 'string' ? router.query.search : '';
    
    console.log('🔄 URL changed, search from URL:', searchFromUrl);
    
    // Only update state if different from current value AND user is not actively typing
    if (searchFromUrl !== searchTerm && !isActivelyTyping.current) {
      console.log('🔄 Updating search term from URL:', searchFromUrl);
      
      // Show loading state when URL changes search term
      setIsSearching(true);
      
      // Update the state with the URL value
      setSearchTerm(searchFromUrl);
      
      // Short delay to simulate loading for better UX
      setTimeout(() => {
        setDebouncedSearchTerm(searchFromUrl);
        setIsSearching(false);
      }, 300);
    }
  }, [router.isReady, router.query.search, searchTerm]);
  
  // Handle clear button click
  const handleClearSearch = () => {
    console.log('🧹 Clearing search');
    
    // Immediately update both local values
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
    
    // Force immediate URL update
    isActivelyTyping.current = false;
    isUpdatingUrl.current = true;
    
    const query = {};
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true })
      .finally(() => {
        setTimeout(() => {
          isUpdatingUrl.current = false;
          
          // Focus on the input field after clearing
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 100);
      });
  };
  
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
    console.log('❌ Rendering error state:', error);
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
    console.log('⏳ Rendering loading state');
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
  
  console.log('🔍 Current search state - term:', searchTerm, 'debounced:', debouncedSearchTerm);
  
  // Use useMemo to prevent unnecessary filtering on each render
  const filteredUsers = useMemo(() => {
    // Skip filtering if no search term
    if (!debouncedSearchTerm?.trim()) {
      console.log('🔄 No search term, showing all users');
      return users;
    }
    
    console.log('🔄 Filtering users with term:', debouncedSearchTerm);
    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    
    // Log a sample of users being searched
    if (users.length > 0) {
      console.log('🔄 First user being searched:', users[0].name, users[0].email, users[0].company.name);
    }
    
    const filtered = users.filter(user => {
      const matchesName = user.name.toLowerCase().includes(searchLower);
      const matchesEmail = user.email.toLowerCase().includes(searchLower);
      const matchesCompany = user.company.name.toLowerCase().includes(searchLower);
      
      return matchesName || matchesEmail || matchesCompany;
    });
    
    console.log(`🔄 Filtering result: ${filtered.length} users match "${searchLower}"`);
    return filtered;
  }, [users, debouncedSearchTerm]);
  
  // Direct search for debug purposes (bypasses debounce)
  const directFilteredUsers = directSearchTerm 
    ? users.filter(user => 
        user.name.toLowerCase().includes(directSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(directSearchTerm.toLowerCase()) ||
        user.company.name.toLowerCase().includes(directSearchTerm.toLowerCase()))
    : users;
    
  console.log(`🔍 Filtered users: ${filteredUsers.length} of ${users.length} match "${debouncedSearchTerm}"`);

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
            <div className="mt-4 md:mt-0 flex space-x-2">
              <div className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-2">
                {isSearching ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-medium">Searching...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="font-medium">{filteredUsers.length} Users</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="bg-gray-200 hover:bg-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {showDebug ? 'Hide Debug' : 'Debug'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Debug Panel */}
        {showDebug && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs font-mono">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Debug Information</h3>
              <Link href="/debug" className="text-blue-600 underline" target="_blank">
                Open Debug Page
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>searchTerm:</strong> "{searchTerm}"</p>
                <p><strong>debouncedSearchTerm:</strong> "{debouncedSearchTerm}"</p>
                <p><strong>URL search:</strong> "{router.query.search || ''}"</p>
                <p><strong>isProcessingURLUpdate:</strong> {isUpdatingUrl.current ? 'true' : 'false'}</p>
              </div>
              <div>
                <p><strong>Total Users:</strong> {users.length}</p>
                <p><strong>Filtered Users:</strong> {filteredUsers.length}</p>
                <p><strong>Users Sample:</strong></p>
                <div className="mt-2 max-h-20 overflow-auto text-xs">
                  {users.slice(0, 3).map(user => (
                    <div key={user.id} className="mb-1">
                      {user.id}: {user.name} ({user.email})
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Direct search test */}
            <div className="mt-4">
              <p className="font-bold mb-1">Direct Search Test (bypasses debounce)</p>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 p-1 text-sm rounded"
                  placeholder="Test direct search..."
                  value={directSearchTerm}
                  onChange={(e) => setDirectSearchTerm(e.target.value)}
                />
                <button 
                  onClick={() => setDirectSearchTerm('')}
                  className="bg-gray-200 px-2 py-1 rounded text-sm"
                >
                  Clear
                </button>
              </div>
              <p>Results: {directFilteredUsers.length} of {users.length}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-blue-50">
            <div className="relative max-w-md">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, email or company..."
                className="block w-full pl-10 pr-9 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => {
                  // Mark as actively typing when input is focused
                  isActivelyTyping.current = true;
                }}
                onBlur={() => {
                  // Short delay before clearing typing state when focus is lost
                  setTimeout(() => {
                    isActivelyTyping.current = false;
                  }, 200);
                }}
                aria-label="Search users"
                autoComplete="off"
                // Prevent any form submission
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    isActivelyTyping.current = false;
                    // Blur and focus again to prevent any stuck behavior
                    if (searchInputRef.current) {
                      searchInputRef.current.blur();
                      setTimeout(() => searchInputRef.current?.focus(), 10);
                    }
                  }
                }}
              />
              {/* Search icon */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              {/* Clear button */}
              {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  type="button"
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        
          {showDebug && directSearchTerm ? (
            // Show direct search results if in debug mode
            <UserTable users={directFilteredUsers} />
          ) : isSearching ? (
            // Show loading state while searching
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Searching users...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            // Show normal filtered results
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