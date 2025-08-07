import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile(){
  const { user, token, updateUserData, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate(); // Used for redirecting


  //Function to handle profile picture change
  function handleProfilePicChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_pic', file);

      fetch('http://localhost:5001/api/upload_profile_pic', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Only add auth header if needed
          // Do NOT set 'Content-Type' header; browser sets it for FormData
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.profilePicUrl) {
            updateUserData({profilePicUrl: data.profilePicUrl});
            alert('Profile picture uploaded!');
          }
        })
        .catch(error => {
          alert('Failed to upload profile picture.');
          console.error(error);
        });
    }
  }

  // CONDITIONAL RENDERING

  // logged in, but still loading
  if (isAuthenticated && !user) {
    return <div className="profile"><h1>Loading profile...</h1></div>;
  }

  // not logged in, redirect to login
  if (!isAuthenticated) {
    return (
    <div className="profile">
      <h1>Please log in or sign up to access your profile!</h1>
      <NavLink className="loginBtn" to="/login">Login</NavLink>
      <NavLink className="signUpBtn" to = "/signup">Sign Up</NavLink>
    </div>);
  }

  return (
    <div class = "profile">
      <h1> Profile </h1>
      <div class="profile-container" style={{ position: "relative", display: "inline-block" }}>
        <img
          src={user.profilePicUrl ? `http://localhost:5001${user.profilePicUrl}`
          : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
          alt="Profile picture"
          class="profile-pic"
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="profilePicInput"
          onChange={handleProfilePicChange}
          ref={input => (window.profilePicInput = input)}
        />
        <button class="upload-profile-pic-btn"
          type="button"
          onClick={() => window.profilePicInput && window.profilePicInput.click()}
          aria-label="Upload Profile Picture"
        >
          +
        </button>
      </div>
      <div class = "info">
        <div class = "username-follow">
          <p class = "profile-element"> @{user.username} </p>
          <span class = "separator">|</span>
          <button class = "follow-button">Follow</button>
        </div>
        <p class = "profile-element"><b>Name:</b> {user.name || 'Not set'}</p>
        <p class = "profile-element"><b>Bio:</b> {user.bio || 'No bio yet.'}</p>
        <p class = "profile-element"># of Friends</p>
        <div class= "profilePgBtns">
          <NavLink className="publishedQuotesBtn" to="/published-quotes">Published Quotes</NavLink>
          <NavLink className="savedQuotesBtn" to="/saved-quotes">Saved Quotes</NavLink>
          <NavLink className="logOutBtn" to = "/login" onClick = {logout}>Log Out</NavLink>
          <NavLink className = "editProfileBtn" to = "/edit-profile">Edit Profile</NavLink>
        </div>
      </div>
    </div>
  );
}

export default Profile;