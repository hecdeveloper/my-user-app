import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { User } from '@/types/user';
import { UserCard } from '@/components/UserCard';
import { useRouter } from 'next/router';

interface UserDetailPageProps {
  user: User;
}

export default function UserDetailPage({ user }: UserDetailPageProps) {
  const router = useRouter();
  
  // If the page is still generating via fallback, show loading
  if (router.isFallback) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center py-12 px-4 bg-white rounded-xl shadow-md">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User not found</h1>
          <p className="text-gray-600 mb-6">The user you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/users" className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-500 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${user.name} | User Directory`}</title>
        <meta name="description" content={`Profile information for ${user.name}`} />
      </Head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/users" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Users
          </Link>
        </div>
        
        <UserCard user={user} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users: User[] = await response.json();
    
    // Pre-render all user pages at build time
    const paths = users.map((user) => ({
      params: { id: user.id.toString() },
    }));
    
    return {
      paths,
      fallback: false, // Changed to false to avoid loading issues
    };
  } catch (error) {
    console.error('Error fetching user paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    if (!params?.id) {
      return {
        notFound: true,
      };
    }
    
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
    
    if (!response.ok) {
      return {
        notFound: true,
      };
    }
    
    const user: User = await response.json();
    
    return {
      props: {
        user,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      notFound: true,
    };
  }
}; 