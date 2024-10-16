import { login } from '../../routes/authService';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    nickname: string;
    password: string;
    setNickname: (nickname: string) => void;
    setPassword: (password: string) => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
    isLogin: boolean;
    setToken: (token: string) => void;
}

function Login({ nickname, password, setNickname, setPassword, setError, setLoading, setToken }: LoginProps) {
    const navigate = useNavigate();

    const validateForm = () => {
        setError('');
        if (!nickname) {
            setError('Nickname is required.');
            return false;
        }
        if (!password) {
            setError('Password is required.');
            return false;
        }
        return true;
    };

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const data = await login({ nickname, password });
            if (data && data.access_token) {
                setToken(data.access_token);
                console.log("Login successful", data);
                navigate('/main');
            } else {
                setError('Invalid nickname or password.');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form>
            <input
                type="text"
                placeholder="Nickname"
                autoComplete="username"
                value={nickname}
                onChange={e => {
                    setNickname(e.target.value);
                    setError('');
                }}
                required
            />
            <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={e => {
                    setPassword(e.target.value);
                    setError('');
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') handleLogin(e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
                }}
                required
            />
            <button onClick={handleLogin}>Login</button>
        </form>
    );
}

export default Login;
