import { User } from '@/types/user';

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
      
      <div className="mt-4 space-y-2">
        <p className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Email:</span> 
          <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">{user.email}</a>
        </p>
        <p className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Phone:</span> {user.phone}
        </p>
        <p className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Company:</span> {user.company.name}
        </p>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium text-gray-700">Address:</h3>
        <address className="mt-1 not-italic text-gray-600">
          {user.address.street}, {user.address.suite}<br />
          {user.address.city}, {user.address.zipcode}
        </address>
      </div>
    </div>
  );
}; 