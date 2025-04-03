import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">User Listing App</h1>
        <p className="text-gray-600 mb-8">A Next.js application to browse and manage user data</p>
        <Link href="/users" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          View Users
        </Link>
      </div>
    </div>
  );
}
