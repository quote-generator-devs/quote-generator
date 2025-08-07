import { NavLink } from 'react-router-dom'; // used for navigation between pages

function NavBar() {
  return (
    <div class="nav">
      <div class="navbar_items">
      <NavLink class="home" to="/">Home </NavLink>
      <NavLink class="feed" to="/feed">Feed </NavLink>
      <NavLink class="activity" to="/activity">Activity</NavLink>
      <NavLink class="saved_quotes" to="/saved-quotes">Saved Quotes</NavLink>
      <NavLink class="about_us" to="/about-us">About Us</NavLink>
      <NavLink class="profile" to="/profile">Profile</NavLink>
      <NavLink class="loginBtn" to="/profile"></NavLink>
      <NavLink class="signUpBtn" to="/profile"></NavLink>
      <NavLink class="publishedQuotesBtn" to="/published-quotes"></NavLink>
      </div>
    </div>
  );
}

export default NavBar;