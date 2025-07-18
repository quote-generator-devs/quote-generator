import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {HashRouter, Routes, Route, NavLink, useSearchParams, useNavigate} from 'react-router-dom'; // used for navigation between pages
import { searchQuotes } from './utils';

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/search" element={<QuotesFound />} />
        <Route path="/about-us" exact element={<AboutUs />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<SignUp />} />
        <Route path = "/profile" exact element = {<Profile />} />
        <Route path = "/activity" exact element = {<Activity />} />
        <Route path = "/saved-quotes" exact element = {<SavedQuotes />} />
      </Routes>
    </HashRouter>
  )
}


function NavBar() {
  return (
    <div class="nav">
      <div class="navbar_items">
      <NavLink class="home" to="/">Home</NavLink>
      <NavLink class="feed" to="/feed">Feed</NavLink>
      <NavLink class="activity" to="/activity">Activity</NavLink>
      <NavLink class="saved_quotes" to="/saved-quotes">Saved Quotes</NavLink>
      <NavLink class="profile" to="/profile">Profile</NavLink>
      <NavLink class="about_us" to="/about-us">About Us</NavLink>
      </div>
    </div>
  );
}

function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    // Navigate to the results page with the query as a URL parameter
    navigate(`/search?query=${query}`);
  };

  return (
    <div class="main_header">
      <div class="quotebook_box">
        <div class="quotebox_text">
          <h2 class="quotebook_title">Quotebook</h2>
          <p class="subtitles">your mood. your quote.</p>
        </div>

        <div class="homeBtns">
          <NavLink className="loginBtn" to="/login">Login</NavLink>
          <NavLink className="signUpBtn" to = "/signup">Sign Up</NavLink>
        </div>
      </div>

      <div class="searchbar">
        <form onSubmit={handleSearch}>
          <input type="text" value={query} 
            placeholder="🔍 Input your mood here for a quote!" 
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submitBtn">Search</button>
        </form>
      </div>
    </div>
  );
}

function Login() {
  return (
    <div class = "login_page"> 
      <div class = "login_header">
        <h2>Quotebook</h2>
      </div>
      <div class = "container">
        <form class="login_form">
          <h3>Login</h3>
          <label for="username"></label>
          <input type = "text" id = "username" name = "Username" placeholder = "Your Username" />
          <br />
          <label for = "password"> </label>
          <input type = "password" id = "password" name="Password" placeholder = "Your Password" />
          <p><b>Don't have an account? </b></p>
          <NavLink to = "/signup"> Sign Up</NavLink>
        </form>
      </div>
    </div>
  );
}

function SignUp(){
  return (
    <div>
      <div class = "signup_header">
        <h2>Quotebook</h2>
      </div>
      <div class = "container">
        <form class = "signup_form">
          <h3>Sign Up</h3>
          <label for = "email"></label>
          <input type = "text" id = "email" name = "Email" placeholder = "Your Email" /> <br />
          <label for = "username"></label>
          <input type = "text" id = "username" name = "Username" placeholder = "Create Username" /> <br />
          <label for = "password"></label>
          <input type = "text" id = "password" name = "Password" placeholder = "Create Password" /> <br />
          <label for = "reenter"></label>
          <input type = "text" id = "reenter" name = "Re-enter" placeholder = "Re-enter Password" />
          <p><b>Already Have an Account?</b></p>
          <NavLink to = "/login"> Login </NavLink>
        </form>
      </div>
    </div>
  );
}

function AboutUs() {
  return (
    <div class="about_us">
      <div class="dev_team">
        <h1>The Creators</h1>
        <div class="devs">
          <div class="dev">
            <img src="https://placehold.co/200" alt="Image of Bhavana Dakshinamoorthy" class="bhavana"/>
            <p>Bhavana Dakshinamoorthy</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/200" alt="Image of Noor Diab" class="noor" />
            <p>Noor Diab</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/200" alt="Image of Daniel Lawler"  class="danny"/>
            <p>Daniel Lawler</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/200" alt="Image of Kaden Spencer" class="kaden"/>
            <p>Kaden Spencer</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/200" alt="Image of Shane Thoma"  class="shane"/>
            <p>Shane Thoma</p>
          </div>
        </div>
      </div>
      
      <div class="dev_description">
        <h2>About Us</h2>
        <p>Sharing quotes and quoting each other has been an amusing and exciting part of our college experience. We created Quotebook to continue our tradition and to share this small, but meaningful part of our lives with the world.</p>
      </div>
    </div>
  );
}

function Profile(){
  return (
    <div class = "profile">
      <h1> Profile </h1>
      <div class = "profile-container">
        <img src = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" alt = "Profile picture" class = "profile-pic"></img>
      </div>
      <div class = "info">
        <div class = "username-follow">
          <p class = "profile-element"> @username </p>
          <span class = "separator">|</span>
          <button class = "follow-button">Follow</button>
        </div>
        <p class = "profile-element"><b>Name</b></p>
        <p class = "profile-element">Bio</p>
        <p class = "profile-element"># of Friends</p>
        <p class = "profile-element">Published Quotes</p>
      </div>
    </div>
  );
}

function QuotesFound() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook to read URL query parameters
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  // useEffect runs when the component mounts or when the 'query' changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await searchQuotes(query);
        if (results.length === 0) {
          setError("No quotes found for that term. Try another!");
        } else {
          setQuotes(results);
        }
      } catch (err) {
        setError("Could not fetch quotes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]); // The effect re-runs if the 'query' in the URL changes

  return (
    <div className="results-page">
      {!query.trim() && <h1>Random Quotes</h1>}
      {query.trim() && <h1>Results for "{query}"</h1>}

      <div className="results-content">
        {isLoading && <p>Loading quotes...</p>}
        {error && <p className="error-message">{error}</p>}
        {quotes.length > 0 && (
          <ul>
            {quotes.map((quote) => (
              <li key={quote._id}>
                <blockquote>"{quote.content}"</blockquote>
                <cite>- {quote.author}</cite>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Activity() {
  return (
    <div class = "activity-container">
      <div class = "activity-header">
        <h1>Activity</h1>
      </div>
      <div class = "friend-requests">
        <button>Friend Requests -{'>'} </button>
      </div>
      <div class = "your-activity">
        <p> <b> Likes </b> </p>
        <p><b>Comments</b></p>
        <p><b>Followers</b> </p>
      </div>
    </div>
  );
}

function SavedQuotes(){
  return (
    <div class = "saved-quotes-container">
      <div class = "saved-quotes-header">
        <h1>Saved Quotes</h1>
      </div>
      <div class = "saved-quotes-body">
        <button> Collections -{'>'} </button>
      </div>
    </div>
  );
}

export default App;
