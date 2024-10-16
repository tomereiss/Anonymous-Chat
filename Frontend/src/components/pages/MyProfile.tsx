import TopNav from '../partials/TopNav';


interface MyProfileProps {
    user: string;
}

function MyProfile({ user }: MyProfileProps) {
    return (
        <div>
            <TopNav currentUsername ={user} />
            <div className="profile-container">
                <h1>User Profile</h1>
                <div className="user-details">
                    {user && <p><strong>Nickname:</strong> {user}</p>}
                </div>
            </div>
        </div>

    );
}

export default MyProfile;
