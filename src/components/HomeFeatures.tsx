import { memo } from 'react';

const HomeFeatures = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6 px-8">
        <h2 className="text-2xl font-bold">Key Features</h2>
      </div>
      <div className="p-8">              
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2 text-center">Search & Filter</h3>
            <p className="text-gray-600 text-center">Easily search and filter users by name, email, or company.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2 text-center">Sortable Data</h3>
            <p className="text-gray-600 text-center">Sort the user list by different columns with a single click.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2 text-center">Detailed Profiles</h3>
            <p className="text-gray-600 text-center">View detailed information for each user in a clean interface.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeFeatures); 