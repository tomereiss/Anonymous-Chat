const API_BASE_URL = 'http://127.0.0.1:8000';

interface LoginSignUpProps {
    nickname: string;
    password: string;
}

// Function to handle login
export async function login({ nickname, password}: LoginSignUpProps) {
    if (!nickname.trim() || !password.trim()) {
        return;
    }
    const url = `${API_BASE_URL}/login`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password })
    });
    if (!response.ok) {
        const errorData = await response.json();  // Ensure this data contains the error detail
        const errorMessage = errorData.detail || 'Failed to login due to an unknown error';
        throw new Error(errorMessage);  // Throwing an error to be caught in the catch block of handleLogin
    }
    return await response.json();
}

export async function signup({nickname, password}:LoginSignUpProps) {
    console.log(nickname);
    if (!nickname.trim() || !password.trim()) {
        return;
    }
    const url = `${API_BASE_URL}/signup`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password })
    });
    if (!response.ok) {
        const errorData = await response.json(); 
        const errorMessage = errorData.detail || 'Failed to login due to an unknown error';
        throw new Error(errorMessage); 
        return;
    }
    return response.json();
}

export async function generateNickname() {
    const url = `${API_BASE_URL}/generate-nickname`;
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json(); 
        const errorMessage = errorData.detail || 'Failed to login due to an unknown error';
        throw new Error(errorMessage);
        return;
    }
    return response.json();
}

export async function APIRequestWithToken(url: string, token: string, method: string = 'GET', body?: string) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const config: RequestInit = {
        method: method,
        headers: headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        config.body = body;
    }

    console.log(`Making a ${method} request to ${url} with body:`, config.body);
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    console.log(response);
    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to fetch data: ${errorMsg}`);
    }

    return response.json();
}
