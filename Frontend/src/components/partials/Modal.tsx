import React, { useState, useEffect } from 'react';
import './Modal.css'; // Ensure your CSS styles the form and dropdown appropriately
import { APIRequestWithToken } from '../../routes/authService';

interface ModalProps {
  token: string;
  onCreateChat: (userId: string) => void;
  onClose: () => void;
}

const Modal = ({ token, onCreateChat, onClose }: ModalProps) => {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Making API call to fetch users");
        const data = await APIRequestWithToken('/users', token, "GET", "");
        console.log("Fetched users:", data.users);
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
          console.error("Fetched data.users is not an array:", data.users);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]); // Ensure users is always an array
      }
    };

    fetchUsers();
  }, [token]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedUser) {
      onCreateChat(selectedUser);
      onClose();
    } else {
      alert('Please select a user to create a chat.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <label htmlFor="user-select">Choose a user:</label>
          <select
            id="user-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          <button type="submit">Create New Chat</button>
          <button type="button" onClick={onClose} className="close-button">✖</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
