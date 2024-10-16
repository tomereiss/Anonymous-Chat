import './RecentChatsBar.css';
import {useState} from 'react';
import { ChatObject } from '../../types/Chat';


interface RecentChatsBarProps {
  onChatSelected: (chatId: string) => void;
  onShowModal: () => void;
  recentChats: ChatObject[];
  loadingRecentChats: boolean;
}

const formatDate = (lastTimestamp: string) => {
  console.log(lastTimestamp);
  if (!lastTimestamp) return '';
  const messageDate = new Date(lastTimestamp);
  if (isNaN(messageDate.getTime())) return 'Invalid date';
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDateString = messageDate.toISOString().split('T')[0];
  const currentDateString = currentDate.toISOString().split('T')[0];
  const yesterdayDateString = yesterday.toISOString().split('T')[0];

  if (messageDateString === currentDateString) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (messageDateString === yesterdayDateString) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString();
  }
};

function RecentChatsBar({ onChatSelected, onShowModal, recentChats, loadingRecentChats}: RecentChatsBarProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    onChatSelected(chatId);
  };



  return (
    <div className="recent-chats-container">
      <h2>Recent Chats</h2>
      {loadingRecentChats && (
        <div className="overlay">
            <div className="spinner"></div>
        </div>
      )}
      {/* {loadingRecentChats ? <div>Loading...</div> :  */}
          {(recentChats ? 
            (<ul className="chat-list">
                {recentChats.map((chat) => (
                  <li
                    key={chat.chat_id}
                    className={`chat-item ${chat.chat_id === activeChatId ? 'active' : ''}`}
                    onClick={() => handleChatSelect(chat.chat_id)}
                  >
                  <div className="chat-item-content">
                    <div>
                        <div className="chat-name">{chat.other_username}</div>
                        <div className="message-snippet">
                          {chat.messages && chat.messages.length > 0 
                            ? chat.messages[chat.messages.length - 1].message.split('. ')[0]
                            : 'No messages yet'}
                        </div>
                    </div>
                  </div>
                  <div className="time">
                      {chat.last_message_timestamp ? formatDate(chat.last_message_timestamp) : ''}
                  </div>
                  </li>
                ))}
              </ul>
            ) : <div>No recent chats</div>
          )}
      {/* } */}
      <button className="new-chat-button" data-title="add new chat" onClick={onShowModal}>+</button>
    </div>
  );
}

export default RecentChatsBar;
