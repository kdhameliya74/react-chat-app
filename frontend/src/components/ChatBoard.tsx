import { Send, User as UserIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { User, userId } from '../types/users';
import { socket } from '../sockets/sockets';
import { getUserMessages } from '../utils/auth';
import NoMessages from './NoMessages';
import { Message } from '../types/message';
import { formatDateTime } from '../utils/helper';

type props = {
  loggedInUser: User | null;
  selectedUser: User | null;
};

const ChatBoard: React.FunctionComponent<props> = ({
  loggedInUser,
  selectedUser,
}: props): React.JSX.Element => {
  const [messages, setMessage] = useState<Message[]>([]);

  const modifiedMessages = useMemo(() => {
    return messages.map((message: Message) => ({
      ...message,
      senderName: `${loggedInUser?.firstname} ${loggedInUser?.lastname}`,
      self: String(loggedInUser?.id) === message.sender,
      receiverName: `${selectedUser?.firstname} ${selectedUser?.lastname}`,
      timestamp: formatDateTime(message.timestamp),
    }));
  }, [messages, loggedInUser, selectedUser]);

  useEffect(() => {
    const fetchMessages = async (user1: userId, user2: userId) => {
      const messages = await getUserMessages(user1, user2);
      setMessage(messages);
    };
    if (loggedInUser?.id && selectedUser?.id) {
      fetchMessages(loggedInUser.id, selectedUser.id);
    }

    socket.on('private_message', (response) => {
      setMessage((prev) => [...prev, response]);
    });

    return () => {
      socket.off('private_message');
    };
  }, [loggedInUser, selectedUser]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msg = e.currentTarget.elements.namedItem('msg') as HTMLInputElement;
    if (msg.value.trim() === '') return;

    const newMessage = {
      sender: loggedInUser?.id,
      receiver: selectedUser?.id,
      message: msg.value,
      timeStamp: new Date().toISOString(),
    };

    socket.emit('private_message', newMessage);
    msg.value = '';
  };

  return (
    <>
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          {selectedUser?.id && (
            <div className="relative flex-shrink-0">
              <div className="p-1 rounded-full text-gray-400 bg-gray-700">
                <UserIcon
                  size={18}
                  className="w-6 h-6 rounded-full text-white"
                />
              </div>
              <span
                className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-1 ring-gray-900 ${
                  selectedUser?.is_online ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></span>
            </div>
          )}

          <div className="ml-2">
            <h2 className="text-lg font-medium text-white">
              {selectedUser?.firstname + ' ' + selectedUser?.lastname}
            </h2>
            <p className="text-xs text-gray-400">
              {selectedUser?.is_online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {modifiedMessages.length ? (
          modifiedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-lg ${
                  msg.self
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {!msg.self && (
                  <p className="text-xs font-medium text-gray-400">
                    {msg.receiverName}
                  </p>
                )}
                <p>{msg.message}</p>
                <p className="text-xs text-right mt-1 opacity-75">
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))
        ) : (
          <NoMessages />
        )}
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-700"
      >
        <div className="flex items-center">
          <input
            type="text"
            name="msg"
            autoComplete="off"
            // onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-r-md hover:from-purple-700 hover:to-indigo-700"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatBoard;
