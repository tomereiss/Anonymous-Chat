import httpx

BASE_URL = "http://127.0.0.1:8000"


def login_test():
    login_url = f"{BASE_URL}/login"  # Replace with your actual login endpoint
    login_credentials = {
        "username": "nickname_72",
        "password": "0209",
    }

    with httpx.Client() as client:
        response = client.post(login_url, data=login_credentials)

    assert response.status_code == 200  # Adjust the expected status code based on your implementation
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]
    print("Login successful. Access Token:", access_token)
    return access_token


def logout_test():
    logout_url = f"{BASE_URL}/logout"  # Correctly include the /logout prefix

    # Get the access token from the login test
    access_token = login_test()
    headers_with_token = {"Authorization": f"Bearer {access_token}"}

    # Test logout with expected status code 200
    with httpx.Client() as client:
        response = client.post(logout_url, headers=headers_with_token)
        assert response.status_code == 200
        assert response.json() == {"message": "Logout successful"}
        print("Logout test (Status Code 200) passed successfully")

    # Test logout with expected status code 400 (or any other error status)
    with httpx.Client() as client:
        response = client.post(logout_url, headers=headers_with_token)
        assert response.status_code == 401  # Adjust the expected error status code based on your implementation
        assert response.json() == {"detail": "Logout failed"}
        print("Logout test (Status Code 400) passed successfully")


def signup_test():
    signup_url = f"{BASE_URL}/signup"  # Replace with your actual signup endpoint
    new_user_data = {
        "password": "test_password",
    }

    with httpx.Client() as client:
        response = client.post(signup_url, data=new_user_data)
    print(response.json())
    assert response.status_code == 200  # Adjust the expected status code based on your implementation
    assert response.json() == {"message": "User created successfully"}
    print("good signup")


def send_message_test():
    login_url = f"{BASE_URL}/login"  # Replace with your actual login endpoint
    sender_credentials = {
        "username": "nickname_72",
        "password": "0209",
    }
    # Login and get the access token for the sender
    with httpx.Client() as client:
        login_response = client.post(login_url, data=sender_credentials)
    assert login_response.status_code == 200
    print("Login (Status Code 200) passed successfully")
    assert "access_token" in login_response.json()

    message = "ok lets test firfir"
    receiver = "user_id_13"

    sender_access_token = login_response.json()["access_token"]
    print(sender_access_token)
    send_message_url = f"{BASE_URL}/chat/send_test?receiver_id={receiver}&content={message}"
    headers_with_token = {"Authorization": f"Bearer {sender_access_token}"}

    with httpx.Client() as client:
        response = client.post(
            send_message_url,
            headers=headers_with_token)
        print(response)
        assert response.status_code == 200
        print("Send Message test (Status Code 200) passed halfway successfully")

        assert response.json() == {"message": "Message sent successfully"}
        print("Send Message test (Status Code 200) passed total successfully")


def get_messages_with_user_test():
    other_user_id = "user_id_2"
    get_messages_url = f"{BASE_URL}/chat/{other_user_id}_test"
    access_token = login_test()
    headers_with_token = {"Authorization": f"Bearer {access_token}"}

    with httpx.Client() as client:
        response = client.get(
            get_messages_url,
            headers=headers_with_token)
        print(response)
        assert response.status_code == 200
        messages_with_user = response.json()
        print(messages_with_user)

        # Perform assertions based on your expected results
        # Modify the assertions based on the structure of the response
        assert isinstance(messages_with_user, dict)
        assert messages_with_user["other_user_id"] == other_user_id
        # Add more assertions as needed

        print(messages_with_user)


def get_chats_test():
    get_chats_url = f"{BASE_URL}/chat/recent_chats_test"
    access_token = login_test()
    headers_with_token = {"Authorization": f"Bearer {access_token}"}

    with httpx.Client() as client:
        response = client.get(
            get_chats_url,
            headers=headers_with_token
        )
        print(response)
        assert response.status_code == 200
        recent_chats = response.json()
        print(recent_chats)

        # Perform assertions based on your expected results
        assert isinstance(recent_chats, list)
        assert all(isinstance(chat, dict) for chat in recent_chats)
        assert len(recent_chats) == 1
        print(recent_chats)


def dynamic_test(kind_of_test: str):
    match kind_of_test:
        case "login":
            login_test()
        case "signup":
            signup_test()
        case "send message":
            send_message_test()
        case "get messages":
            get_messages_with_user_test()
        case "get chats":
            get_chats_test()
        case "logout":
            logout_test()


dynamic_test("get chats")


