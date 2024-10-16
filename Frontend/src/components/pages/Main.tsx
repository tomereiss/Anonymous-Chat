import React, { useState, useEffect } from 'react';
import RecentChatsBar from '../partials/RecentChatsBar';
import TopNav from '../partials/TopNav';
import Chat from '../partials/Chat';
import { fetchChats, handleCreateChat } from '../../routes/chatServices';
import Modal from '../partials/Modal';
import { ChatObject } from '../../types/Chat';
import './Main.css';

interface MainProps {
  currentUsername: string;
  token: string;
}


function Main({ currentUsername, token }: MainProps) {
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [recentChats, setChats] = useState<ChatObject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingRecentChats, setLoadingRecentChats] = useState(false);
  const [loadingChats, setLoadingChat] = useState(false);


  // Add a console log to see when the component re-renders
  console.log('Main component rendered');

  useEffect(() => {
    console.log("Fetching chats on mount or token change");
    const fetchChatsData = async () => {
      await fetchChats(token, setChats, setLoadingRecentChats);
    };
    fetchChatsData();
  }, [token, setChats]);


  const handleChatSelect = (chatId: string) => {
    console.log(`Chat selected: ${chatId}`);
    setSelectedChat(chatId);
  };

  const handleModalToggle = () => {
    console.log('Modal toggled');
    setShowModal(!showModal);
  };

  const handleCreateChatAndUpdate = async (userId: string) => {
    console.log(`Creating chat with user: ${userId}`);
    await handleCreateChat(userId, token, setChats, setLoadingRecentChats);
    setShowModal(false);
  };


  return (
    <div>
      <TopNav currentUsername={currentUsername} />
      <div className="content-area">
        {showModal && (
          <Modal
          token={token}
          onCreateChat={handleCreateChatAndUpdate}
          onClose={() => setShowModal(false)}
        />
        )}
        <RecentChatsBar 
          onChatSelected={handleChatSelect} 
          onShowModal={handleModalToggle}
          recentChats={recentChats}
          loadingRecentChats={loadingRecentChats}
        />
        <Chat 
          selectedChat={selectedChat}
          token={token}
          currentUsername={currentUsername}
          loadingChats={loadingChats}
          setLoading={setLoadingChat}
        />
      </div>
    </div>
  );
}

export default Main;
