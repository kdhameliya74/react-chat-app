import { User } from '../types/users';
import { User as UserIcon } from 'lucide-react';

type props = {
  selectUserForChat: (user: User) => void;
  users: User[];
  selectedUser: User | null;
};

const ChatList: React.FunctionComponent<props> = ({
  selectUserForChat,
  selectedUser,
  users,
}: props): React.JSX.Element => {
  return (
    <div className="w-64 bg-gray-800 overflow-y-auto">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="px-4 py-2 mt-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Direct Messages
        </h2>
        <div className="mt-2 space-y-1">
          {users.length &&
            users.map((user) => (
              <button
                key={user.id}
                onClick={() => selectUserForChat(user)}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-700 text-left cursor-pointer ${
                  user.id === selectedUser?.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="relative flex-shrink-0">
                    <div className="border-1 rounded-full from-purple-600 bg-gradient-to-br to-indigo-600 p-1">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-1 ring-gray-800 ${
                        user.is_online ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></span>
                  </div>
                  <span className="ml-2 text-gray-300">
                    {user.firstname + ' ' + user.lastname}
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
