import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {useState} from 'react';

function Home() {
  const { isAuthenticated, logout, user } = useAuth();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    // Navigate to the results page with the query as a URL parameter
    navigate(`/search?query=${query}`);
  };

  // Auto-update footer years
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearDisplay = startYear === currentYear ? startYear : `${startYear}–${currentYear}`;

  return (
    <div className="home_wrapper">
      <div class="main_header">
        <div class="quotebook_box">
          <div class="quotebox_text">
            <h2 class="quotebook_title">Quotebook</h2>
            <p class="subtitles">your mood. your quote.</p>
          </div>

          <div class="homeBtns">
            {isAuthenticated && user ? (
              <>
                <p className="welcome_msg">Welcome, {user.username}!</p>
                <button onClick={logout} className="logOutBtn">Log Out</button>
              </>
            ) : (
              <>
                <NavLink className="loginBtn" to="/login">Login</NavLink>
                <NavLink className="signUpBtn" to = "/signup">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>

        <div class="searchbar">
          <form onSubmit={handleSearch}>
            <input type="text" value={query} maxLength="100"
              placeholder="🔍 Input your mood here for a quote!" 
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="submitBtn">Search</button>
          </form>
        </div>

        
      </div>
      <footer>
        <p className="trademark">&copy; {yearDisplay} Quotebook <span>&trade;</span></p>
      </footer>
    </div>
  );
}

export default Home;