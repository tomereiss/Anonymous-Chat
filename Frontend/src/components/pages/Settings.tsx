import React, { useState } from 'react';
import TopNav from '../partials/TopNav';

interface SettingsProps {
    user: string;
}

function Settings({ user }: SettingsProps) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [theme, setTheme] = useState<string>('light'); // 'light' or 'dark'

    const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotificationsEnabled(event.target.checked);
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    };

    return (
        <div className="settings-container">
            <TopNav currentUsername ={user} />
            <h1>Chat Settings</h1>
            <form>
                <div className="setting-item">
                    <label>
                        Enable Notifications:
                        <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={handleNotificationChange}
                        />
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        Theme:
                        <select value={theme} onChange={handleThemeChange}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>
                </div>
                <button type="button" onClick={() => alert('Settings saved!')}>
                    Save Settings
                </button>
            </form>
        </div>
    );
}

export default Settings;
