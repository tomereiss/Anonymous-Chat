import uuid
from datetime import datetime
import firebase_admin
import pytz
from firebase_admin import credentials, auth, firestore
from fastapi import HTTPException
from app.models.chat import Message
from typing import List, Dict, Optional
from app.layers.interfaces import IDataManager

# Initialize Firebase Admin SDK with your Firebase credentials
cred = credentials.Certificate(
    "C:/Users/97250/Desktop/synaps/חפיפה/AnonymousChat/Backend/hafifa-6ee43-firebase-adminsdk-nyc30-e87a2134e9.json"
)
firebase_admin.initialize_app(cred)
db = firestore.client()
ISRAEL_TZ = pytz.timezone('Asia/Jerusalem')


class FirebaseDataManager(IDataManager):

    def create_user(self, user_data: Dict) -> Dict:
        try:
            hash_password = user_data['hash_password']
            username = user_data['username']
            print(username,  hash_password)
            email = f"{uuid.uuid4()}@example.com"
            user = auth.create_user(
                email=email,
                password=hash_password
            )

            # Set the display name separately
            auth.update_user(
                user.uid,
                display_name=username
            )
            db.collection('users').document(user.uid).set(user_data)
            print(f"Successfully created anonymous user: {user_data['username']} with UID: {user.uid}")
            return {
                'uid': user.uid,
                'username': username,
                'hash_password': hash_password
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_user_by_username(self, username: str) -> Optional[Dict]:
        try:
            user_query_docs = db.collection('users').where('username', '==', username).limit(1).get()
            if user_query_docs:
                user_doc = user_query_docs[0]
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    print(f"User found: {user_data['username']}")
                    print(user_data)
                    return {
                        'uid': user_doc.id,
                        'username': user_data['username'],
                        'hash_password': user_data['hash_password'],
                    }
                else:
                    print(f"No user found with username: {username}")
                    return None
            else:
                print(f"No user found with username: {username}")
                return None

        except Exception as e:
            print(f"Error retrieving user by username {username}: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def get_user_by_uid(self, uid: str) -> Optional[Dict]:
        try:
            user_doc = db.collection('users').document(uid).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                # print(f"User found: {username}")
                return user_data
            return None
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_hash_password(self, uid: str) -> Optional[str]:
        try:
            user_data = self.get_user_by_uid(uid)
            if user_data:
                return user_data['hash_password']
            # user_query = db.collection('users').document(uid)
            # doc = user_query.get()
            # if doc.exists:
            #     return doc.to_dict().get('hash_password')
            else:
                print(f"User not found with nickname: {uid}")
                return None
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def update_user(self, uid: str, user_data: dict) -> None:
        print("do nothing at this point")

    def get_all_sign_users(self) -> List[str]:
        try:
            all_users = []
            users_query_ref = db.collection('users').get()
            for doc in users_query_ref:
                user_data = doc.to_dict()
                all_users.append(user_data.get('username'))
            return all_users
        except Exception as e:
            print(f"Error fetching users: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to fetch users")

    def __private_get_user_chats_ref(self, uid: str):
        try:
            user_chats_query = db.collection('users').document(uid).collection('chats')
            if user_chats_query:
                return user_chats_query
            else:
                print(f"no chats for User: {uid}")
                return None
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def create_chat(self, current_username: str, other_username: str, current_chat_id: str, other_chat_id: str,
                    current_user_id: str, other_user_id: str) -> None:
        try:
            current_chat_data = {
                'chat_id': current_chat_id,
                'other_username': other_username,
                'messages': [],
                'last_message_timestamp': ""
            }

            other_chat_data = {
                'chat_id': other_chat_id,
                'other_username': current_username,
                'messages': [],
                'last_message_timestamp': ""
            }

            current_user_chat_ref = self.__private_get_user_chats_ref(current_user_id).document(current_chat_id)
            other_user_chat_ref = self.__private_get_user_chats_ref(other_user_id).document(other_chat_id)

            current_user_chat_ref.set(current_chat_data)
            other_user_chat_ref.set(other_chat_data)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def send_message(self, sender_id: str, receiver_id: str, sender_username: str, receiver_username: str,
                     sender_chat_id: str, receiver_chat_id: str, content: str) -> Dict:
        try:
            timestamp = datetime.now(ISRAEL_TZ).isoformat()
            print(timestamp)
            m = Message(
                sender_username=sender_username,
                receiver_username=receiver_username,
                message=content,
                timestamp=timestamp  # Ensure the timestamp is set correctly
            ).model_dump()

            print(m)

            chat_ref_sender = self.__private_get_user_chats_ref(sender_id).document(sender_chat_id)
            chat_ref_receiver = self.__private_get_user_chats_ref(receiver_id).document(receiver_chat_id)

            chat_ref_sender.update({
                'messages': firestore.ArrayUnion([m]),
                'last_message_timestamp': m['timestamp']  # Update last_message_timestamp
            })

            chat_ref_receiver.update({
                'messages': firestore.ArrayUnion([m]),
                'last_message_timestamp': m['timestamp']  # Update last_message_timestamp
            })

            return m
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_recent_chats(self, uid: str, limit: int = 20) -> List[Dict]:
        # Retrieve recent chats for the specified user
        user_chats_ref = self.__private_get_user_chats_ref(uid)
        query = user_chats_ref.limit(limit)
        recent_chats_snapshots = query.get()
        recent_chats = [chat.to_dict() for chat in recent_chats_snapshots]
        return recent_chats

    def get_chat_with_user(self, current_id: str, current_username: str, other_username: str) -> Optional[Dict]:
        # Retrieve chat messages between two users
        chat_ref = (self.__private_get_user_chats_ref(current_id).where('other_username', '==', other_username)
                    .limit(1).get())
        if not chat_ref:
            print(f"No chat found between {current_username} and {other_username}")
            return None  # or return an empty object or appropriate response
        chat = chat_ref[0].to_dict()
        return chat


