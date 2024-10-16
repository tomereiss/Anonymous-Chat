// Define the message structure separately
interface ChatMessageObject {
    message: string;
    receiver_username: string;
    sender_username: string;
    timestamp: string;
  }
  
  // Define the chat structure
  interface ChatObject {
    chat_id: string;
    other_username: string;
    last_message_timestamp: string;
    messages: ChatMessageObject[]; // Use an array of ChatMessage
  }
  
  // Export the Chat interface
  export type { ChatObject, ChatMessageObject };