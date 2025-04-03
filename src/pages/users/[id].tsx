import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { User } from '@/types/user';
import { UserCard } from '@/components/UserCard';

interface UserDetailPageProps {
  user: User;
}

export default function UserDetailPage({ user }: UserDetailPageProps) {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User not found</h1>
          <Link href="/users" className="text-blue-500 hover:underline">
            Back to users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{user.name} | User Details</title>
        <meta name="description" content={`Profile information for ${user.name}`} />
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/users" className="flex items-center text-blue-500 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Users
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Details</h1>
        <UserCard user={user} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users: User[] = await response.json();
    
    const paths = users.map((user) => ({
      params: { id: user.id.toString() },
    }));
    
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching user paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
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