import { User } from '@/types/user';
import { memo } from 'react';

interface UserCardProps {
  user: User;
}

export const UserCard = memo(({ user }: UserCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
        <div className="flex items-center justify-center mb-4">
          <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-lg">
            <span className="text-4xl font-bold">{user.name.charAt(0)}</span>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-blue-100">{user.company.name}</p>
        </div>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-blue-600 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline font-medium">
                    {user.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${user.phone}`} className="text-gray-700 font-medium">
                    {user.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500 mb-1">Company</p>
                  <p className="text-gray-700 font-medium">
                    {user.company.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-blue-600 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address
            </h3>
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500 mb-1">Street</p>
                  <p className="text-gray-700 font-medium">{user.address.street}, {user.address.suite}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500 mb-1">City & Zip</p>
                  <p className="text-gray-700 font-medium">{user.address.city}, {user.address.zipcode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard; 