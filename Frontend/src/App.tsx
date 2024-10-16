import { useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/pages/Main';
import AnonymousLogin from './components/pages/AnonymousLogin';
import MyProfile from './components/pages/MyProfile';
import Settings from './components/pages/Settings';
import './App.css';



function App() {
  const [currentUser, setCurrentUser] = useState('');
  const [token, setToken] = useState('');
  return (
    <div className="app">
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
        </link>
          <div className="top-strip"></div>
          <div className="app-body">
          <Router>
              <Routes>
                  <Route path="/" element=
                  {<AnonymousLogin 
                      nickname={currentUser} 
                      setNickname={setCurrentUser} 
                      setToken={setToken} />} />
                  <Route path="/main" element=
                  {<Main 
                    currentUsername={currentUser}
                    token = {token}/>} /> 
                  <Route path="/:currentUser" element={<MyProfile user={currentUser}/>} />
                  <Route path="/settings" element={<Settings user={currentUser} />} />
              </Routes>
          </Router>
          </div>
    </div>

  );
}


export default App
