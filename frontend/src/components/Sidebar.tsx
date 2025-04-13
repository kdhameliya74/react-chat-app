import {
  Users,
  MessageCircle,
  LogOut,
  Home as HomeIcon,
  Moon,
  Settings,
} from 'lucide-react';
import { logout } from '../utils/auth';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();
  const logoutHandler = useCallback((): void => {
    logout();
    navigate('/login');
  }, []);

  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-6 border-r border-gray-700">
      <div className="flex flex-col items-center space-y-6">
        <button className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600">
          <HomeIcon size={20} className="text-white" />
        </button>
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700">
          <MessageCircle size={20} />
        </button>
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700">
          <Users size={20} />
        </button>
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700">
          <Settings size={20} />
        </button>
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700">
          <Moon size={20} />
        </button>
      </div>
      <div className="mt-auto">
        <button
          title="logout"
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-700"
          onClick={logoutHandler}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
