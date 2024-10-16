import './TopNav.css';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  currentUsername: string ;
}  
function TopNav({currentUsername}: NavBarProps){
  const navigate = useNavigate(); // Hook to get the navigate function

    return (
        <div className="nav-strip">
          <div className="left-icons">
                <i className="fas fa-sign-out-alt icon" data-title="Logout" onClick={()=>navigate('/')}></i>  {/* Logout icon */}
          </div>
          <div className="right-icons">
                <i className="fas fa-home icon" data-title="Home" onClick={()=>navigate('/main')}></i>
                <i className="fas fa-user icon" data-title="My Profile" onClick={()=>navigate(`/${currentUsername}`)}></i>
                <i className="fas fa-cog icon" data-title="Settings" onClick={()=>navigate('/settings')}></i>
          </div>
        </div>
    );
}

export default TopNav;