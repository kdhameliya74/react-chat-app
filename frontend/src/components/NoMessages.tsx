import React from 'react';

const NoMessages: React.FC = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="text-gray-400 flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-transparent mb-2 bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">
          No messages yet
        </h2>
        <p className="text-center">
          You can initiate the conversation by sending a message. <br />
          Happy sending!
        </p>
        <div className="mt-4 text-sm">
          <p>Feel free to reach out and start chatting!</p>
        </div>
      </div>
    </div>
  );
};

export default NoMessages;
