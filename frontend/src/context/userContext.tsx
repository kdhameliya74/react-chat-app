import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from 'react';
import { User } from '../types/users';
import { getOnlineUsers } from '../utils/auth';
import { socket } from '../sockets/sockets';

// --------------------
// Type Definitions
// --------------------
type UserContextType = {
  loggedInUser: User | null;
  users: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
};

// --------------------
// Default Context Value
// --------------------
const UserContext = createContext<UserContextType>({
  loggedInUser: null,
  users: [],
  selectedUser: null,
  setSelectedUser: () => {},
});

// --------------------
// Provider Props
// --------------------
type Props = {
  children: ReactNode;
};

// --------------------
// Context Provider
// --------------------
export const UserProvider = ({ children }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Register/disconnect socket on login/logout
  useEffect(() => {
    if (loggedInUser) {
      socket.connect();
      socket.emit('register', loggedInUser.id);
    }

    return () => {
      console.log('connection lost');
      if (loggedInUser?.id) {
        socket.emit('user-disconnected', loggedInUser.id);
        socket.disconnect();
      }
    };
  }, [loggedInUser]);

  // Fetch users and initialize state
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      const onlineUsers = await getOnlineUsers();
      const loggedIn = localStorage.getItem('current_user');
      if (loggedIn) {
        const parsedUser: User = JSON.parse(loggedIn);
        setLoggedInUser(parsedUser);
        setUsers(onlineUsers.filter((user) => user.id !== parsedUser.id));
      }
    };
    fetchOnlineUsers();
  }, []);

  // Memoized setter
  const selectUserForChat = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  return (
    <UserContext.Provider
      value={{
        loggedInUser,
        users,
        selectedUser,
        setSelectedUser: selectUserForChat,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// --------------------
// Custom Hook
// --------------------
export const useUser = () => useContext(UserContext);
