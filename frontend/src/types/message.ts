export interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
  senderName?: string;
  receiverName?: string;
  self?: boolean;
}
