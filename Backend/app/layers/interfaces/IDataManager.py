from abc import ABC, abstractmethod
from typing import List, Dict, Optional


class IDataManager(ABC):

    # User methods

    @abstractmethod
    def create_user(self, user_data: Dict) -> Dict:
        """Create a new user with specified data."""
        pass

    @abstractmethod
    def get_user_by_username(self, username: str) -> Optional[Dict]:
        """Retrieve a user's details by their username."""
        pass

    def get_user_by_uid(self, uid: str) -> Optional[Dict]:
        """Retrieve a user's details by their uid."""
        pass

    @abstractmethod
    def get_hash_password(self, uid: str) -> Optional[str]:
        """Retrieve the hashed password for a specific user ID."""
        pass

    @abstractmethod
    def update_user(self, uid: str, user_data: Dict) -> None:
        """Update a user's details by their unique ID."""
        pass

    @abstractmethod
    def get_all_users(self) -> List[str]:
        """Get usernames of all users."""
        pass

    # Chat methods
    @abstractmethod
    def create_chat(self, current_username: str, other_username: str, current_chat_id: str, other_chat_id: str,
                    current_user_id: str, other_user_id: str) -> None:
        """Create a new chat between two users."""
        pass

    # @abstractmethod
    # def set_chat(self, uid: str, chat_data: Dict) -> None:
    #     """Create or update chat data for a specific user."""
    #     pass

    @abstractmethod
    def send_message(self, sender_id: str, receiver_id: str, sender_username: str, receiver_username: str,
                     sender_chat_id: str, receiver_chat_id: str, content: str) -> Dict:
        """Store a message in a chat identified by chat ID."""
        pass

    @abstractmethod
    def get_recent_chats(self, uid: str, limit: int) -> List[Dict]:
        """Retrieve all chats associated with a user."""
        pass

    @abstractmethod
    def get_chat_with_user(self, current_id: str, current_username: str, other_username: str) -> Optional[Dict]:
        """Retrieve all messages from a specific chat."""
        pass


