import { useState, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { User } from '@/types/user';
import Head from 'next/head';
import Link from 'next/link';

// This is a debug page to test search functionality directly
export default function DebugPage({ users }: { users: User[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Directly apply filtering without any debounce or state layers
  const filteredUsers = useMemo(() => {
    console.log('🐛 Debug: Filtering with search term:', searchTerm);
    
    if (!searchTerm) return users;
    
    const matches = users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(term);
      const matchesEmail = user.email.toLowerCase().includes(term);
      const matchesCompany = user.company.name.toLowerCase().includes(term);
      
      console.log('🐛 Debug:', { 
        id: user.id, 
        name: user.name, 
        matchesName,
        email: user.email,
        matchesEmail,
        company: user.company.name,
        matchesCompany,
        matches: matchesName || matchesEmail || matchesCompany
      });
      
      return matchesName || matchesEmail || matchesCompany;
    });
    
    console.log(`🐛 Debug: Found ${matches.length} matches of ${users.length} total`);
    return matches;
  }, [users, searchTerm]);

  return (
    <>
      <Head>
        <title>Debug Search</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Debug Search</h1>
        <Link href="/users" className="text-blue-600 underline mb-6 block">Back to Users</Link>
        
        <div className="p-4 bg-gray-100 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Search Test</h2>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-sm">
            <p>Search term: "{searchTerm}"</p>
            <p>Results: {filteredUsers.length} of {users.length}</p>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        <div className="overflow-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Company</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border hover:bg-gray-50">
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.company.name}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">All Users (Debug)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <div key={user.id} className="p-4 border rounded shadow-sm hover:shadow">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Company:</strong> {user.company.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      return {
        props: {
          users: [],
        },
      };
    }
    
    const users: User[] = await response.json();

    return {
      props: {
        users,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    
    return {
      props: {
        users: [],
      },
    };
  }
}; 