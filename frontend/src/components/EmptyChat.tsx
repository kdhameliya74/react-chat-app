import { MessageCircle } from 'lucide-react';

const EmptyChat: React.FunctionComponent = (): React.JSX.Element => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <MessageCircle size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to DarkChat</h2>
        <p className="mt-2 text-gray-400">
          Select a conversation to start chatting
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;
