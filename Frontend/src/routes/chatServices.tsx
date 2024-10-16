import { APIRequestWithToken } from './authService';
import { ChatObject, ChatMessageObject } from '../types/Chat'; 

  export async function handleCreateChat(
    other_username: string, 
    token: string, 
    setChats: (updateFn: (prevChats: ChatObject[]) => ChatObject[]) => void,
    setLoading: (s: boolean) => void
  ): Promise<void> {
    setLoading(true);
    try {
      const payload = JSON.stringify({ other_username });
      console.log("Sending payload to create chat:", payload); // Debug: Log what we send to the server
  
      // API call to create a new chat
      const response = await APIRequestWithToken('/chat/create', token, 'POST', payload);
      
      if (response.error) {
        throw new Error(`Failed to fetch data: ${response.error}`);
      }
      console.log(response.message); // Debug: Log the response from the server
  
      await fetchChats(token, setChats, setLoading);
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setLoading(false);
    }
  }

  export async function fetchChats(
    token: string, 
    setChats: (updateFn: (prevChats: ChatObject[]) => ChatObject[]) => void,
    setLoading: (s: boolean) => void
  ): Promise<void> {
    setLoading(true);
    try {
      const response = await APIRequestWithToken('/chat/recent_chats', token, "GET", "");
      if (response.error) {
        throw new Error(`Failed to fetch recent chats: ${response.error}`);
      }
      setChats(response.recent_chats);
    } catch (error) {
      console.error('Failed to fetch recent chats:', error);
    } finally {
      setLoading(false);
    }
  }

  export async function fetchChatMessages(
    token: string, 
    setLoading: (s: boolean) => void,
    otherUsername: string,
    setMessages: (messages: (prev: ChatMessageObject[]) => ChatMessageObject[]) => void

  ){
    setLoading(true);
    try {
      const encodedOtherUsername = encodeURIComponent(otherUsername);
      const data = await APIRequestWithToken(`/chat/${encodedOtherUsername}?other_username=${encodedOtherUsername}`, token, 'GET');
      if (data.chat && Array.isArray(data.chat.messages)) {
        setMessages(data.chat.messages.map((msg: ChatMessageObject) => ({
          message: msg.message,
          sender_username: msg.sender_username,
          timestamp: msg.timestamp,
          receiver_username: msg.receiver_username
        })));
      } else {
        setMessages(() => []);
        console.error('No messages found or data is improperly formatted:', data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages(() => []);
    } finally {
      setLoading(false);
    }
  }

  export async function handleSendMessage(
    inputMessage: string, 
    setInputMessage : (s: string) => void,
    currentUsername: string,
    otherUsername: string, 
    token: string,
    setLoading: (s: boolean) => void,
    setMessages: (messages: (prev: ChatMessageObject[]) => ChatMessageObject[]) => void
  ){
    if (inputMessage.trim() === '') {
      return;
    }

    const payload = {
      receiver_username: otherUsername,
      message: inputMessage
    };

    const newMessage: ChatMessageObject = {
      message: inputMessage,
      sender_username: currentUsername,  // Change as needed to fit your data structure
      timestamp: new Date().toISOString(),
      receiver_username: otherUsername // Change as needed to fit your data structure
    };


    try {
      setInputMessage('');
      setMessages(prev => [...prev, newMessage]);  // Optimistically update messages
      const response = await APIRequestWithToken('/chat/send', token, 'POST', JSON.stringify(payload));
      if (!response.ok) throw new Error('Failed to send message');
      const responseData = await response.json();
      console.log("Message sent response:", responseData);
      // fetchChatMessages(token, setLoading,  otherUsername, setMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }