import { useState } from 'react';
import './AnonymousLogin.css';
import Signup from '../partials/Signup';
import Login from '../partials/Login';

interface LoginProps {
    nickname: string;
    setNickname: (nickname: string) => void;
    setToken: (token: string) => void;
}

function LoginSignup({ nickname, setNickname, setToken }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignupSuccess = (newNickname: string) => {
        setNickname(newNickname);
        setPassword('');
        setIsLogin(true);
        setError('');
    };
    return (
        <div className="login-signup-container">
            <div className="hacker-image"></div>
            {loading && (
                <div className="overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="form-container" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
                <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                {error && <div className="error-message">{error}</div>}
                {!isLogin && (
                    <Signup
                        nickname={nickname}
                        password={password}
                        setNickname={setNickname}
                        setPassword={setPassword}
                        setError={setError}
                        setLoading={setLoading}
                        onSignupSuccess={handleSignupSuccess}
                    />
                )}
                {isLogin && (
                    <Login
                        nickname={nickname}
                        password={password}
                        setNickname={setNickname}
                        setPassword={setPassword}
                        setError={setError}
                        setLoading={setLoading}
                        isLogin={isLogin}
                        setToken={setToken}
                    />
                )}
                <p onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setNickname('');
                    setPassword('');
                }}>
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
}

export default LoginSignup;
