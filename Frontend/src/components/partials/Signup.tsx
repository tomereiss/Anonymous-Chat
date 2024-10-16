import { generateNickname, signup } from '../../routes/authService';
import { useState } from 'react';

interface SignupProps {
    nickname: string;
    password: string;
    setNickname: (nickname: string) => void;
    setPassword: (password: string) => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
    onSignupSuccess: (nickname: string) => void;
}

function Signup({ nickname, password, setNickname, setPassword, setError, setLoading, onSignupSuccess }: SignupProps) {
    const [suggestedNicknames, setSuggestedNicknames] = useState<string[]>([]);

    const handleGenerateNickname = async () => {
        try {
            const data = await generateNickname();
            setSuggestedNicknames(data.nicknames);
        } catch (error) {
            setError("Failed to generate nickname");
        }
    };

    const validateForm = () => {
        setError('');
        if (!nickname) {
            setError('Nickname must be generated.');
            return false;
        }
        if (!password) {
            setError('Password is required.');
            return false;
        }
        return true;
    };

    const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoading(true);
        if (!validateForm()) {
            setLoading(false);
            return;
        }
        try {
            const data = await signup({ nickname, password});
            console.log("Signup successful", data);
            onSignupSuccess(nickname); // Notify parent component of successful signup
            // setPassword(password);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form>
            <button onClick={handleGenerateNickname} className="generate-nickname-btn">
                Generate Nickname
            </button>
            {suggestedNicknames.length > 0 && (
                <div className="button-container">
                    <label htmlFor="nickname-buttons">Choose a nickname:</label>
                    <div id="nickname-buttons">
                        {suggestedNicknames.map((name, index) => (
                            <button key={index}
                                onClick={() => setNickname(name)}
                                className={`nickname-button ${nickname === name ? "selected" : ""}`}>
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => {
                    setPassword(e.target.value);
                    setError('');
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') handleSignUp(e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
                }}
                required
            />
            <button onClick={handleSignUp}>Sign Up</button>
        </form>
    );
}

export default Signup;
