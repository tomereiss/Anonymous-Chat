import { useState, useEffect, useRef} from 'react';
import {fetchChatMessages, handleSendMessage} from '../../routes/chatServices'
import { ChatMessageObject } from '../../types/Chat';
import './Chat.css';

// const API_BASE_URL = 'http://127.0.0.1:8000';

interface ChatProps {
    selectedChat: string;
    token: string;
    currentUsername: string;
    loadingChats: boolean;
    setLoading: (s:boolean) => void;
}

const getOtherUserId = (chatId: string, currentUsername: string ) => {
  const names = chatId.split("_");
  const otherUsername = names[0] === currentUsername ? names[1] : names[0];
  console.log(otherUsername);
  return otherUsername;
}

function Chat({selectedChat, token, currentUsername, loadingChats, setLoading}: ChatProps){
    
    const [messagesInChat, setMessages] = useState<ChatMessageObject[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const otherUsernameRef = useRef(getOtherUserId(selectedChat, currentUsername));

    useEffect(() => {
      otherUsernameRef.current = getOtherUserId(selectedChat, currentUsername);
    }, [selectedChat, currentUsername]);
  

    useEffect(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    }, [messagesInChat]);
  
    useEffect(() => {
      if (selectedChat) {
        fetchChatMessages(token, setLoading, otherUsernameRef.current, setMessages);
        setInputMessage('');
      } else {
        setMessages([]);
      }
    }, [selectedChat, token]);


    const sendMessage = async () => {
      handleSendMessage(inputMessage, setInputMessage,currentUsername,  otherUsernameRef.current, token, setLoading, setMessages);
    }

    return (
      <div className="chat-container">
          {selectedChat ? (
            <>
              <div className="chat-title">{otherUsernameRef.current}</div>
              {loadingChats && (
                <div className="overlay-chat">
                    <div className="spinner"></div>
                </div>
              )}
              <div className="messages-container" ref={messageContainerRef}>
                  {messagesInChat.map((message, index) => (
                    <div key={index} className={`message ${message.sender_username === currentUsername ? 'user-message' : 'bot-message'}`}>
                      <span>{message.message}</span>
                      <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
              </div>
              <div className="input-container">
                <input
                    className="input-field"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }}}
                />
                <button onClick={sendMessage} className="send-button"> &#10148; </button>
              </div>
            </>
          ) : (
            <div className="chat-background">
            </div>
          )}
      </div>
  );
}

export default Chat;
