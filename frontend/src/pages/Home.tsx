import Sidebar from '../components/Sidebar';
import ChatList from '../components/ChatList';
import ChatBoard from '../components/ChatBoard';
import EmptyChat from '../components/EmptyChat';
import { useUser } from '../context/userContext';

const Home = () => {
  const { setSelectedUser, users, selectedUser, loggedInUser } = useUser();

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />

      <ChatList
        selectedUser={selectedUser}
        users={users}
        selectUserForChat={setSelectedUser}
      />

      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
        {selectedUser?.id ? (
          <ChatBoard selectedUser={selectedUser} loggedInUser={loggedInUser} />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default Home;
