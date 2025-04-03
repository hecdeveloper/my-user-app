import { useState, memo, useCallback } from 'react';
import { User } from '@/types/user';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface UserTableProps {
  users: User[];
}

type SortField = 'name' | 'email' | 'company.name';
type SortDirection = 'asc' | 'desc';

// Make the user row a separate component to optimize rendering
const UserRow = memo(({ user }: { user: User }) => {
  const router = useRouter();
  
  // Use router.push for programmatic navigation
  const navigateToUserDetail = useCallback(() => {
    router.push(`/users/${user.id}`);
  }, [router, user.id]);
  
  return (
    <tr key={user.id} className="hover:bg-blue-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <span className="text-sm font-medium">{user.name.charAt(0)}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-800">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{user.company.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link 
          href={`/users/${user.id}`} 
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          View Details
        </Link>
      </td>
    </tr>
  );
});

UserRow.displayName = 'UserRow';

export const UserTable = memo(({ users }: UserTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        return field;
      } else {
        setSortDirection('asc');
        return field;
      }
    });
  }, []);

  const sortedUsers = [...users].sort((a, b) => {
    let valueA: string;
    let valueB: string;

    if (sortField === 'company.name') {
      valueA = a.company.name;
      valueB = b.company.name;
    } else {
      valueA = a[sortField as keyof Pick<User, 'name' | 'email'>];
      valueB = b[sortField as keyof Pick<User, 'name' | 'email'>];
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Name
                {sortField === 'name' && (
                  <span className="ml-1 text-blue-100">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center">
                Email
                {sortField === 'email' && (
                  <span className="ml-1 text-blue-100">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('company.name')}
            >
              <div className="flex items-center">
                Company
                {sortField === 'company.name' && (
                  <span className="ml-1 text-blue-100">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}); 