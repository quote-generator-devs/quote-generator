import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {HashRouter, Routes, Route, NavLink, useSearchParams, useNavigate} from 'react-router-dom'; // used for navigation between pages
import { searchQuotes, addUser, validateUser, getUser } from './utils';

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
        <Route path = "/feed" exact element = {<Feed />} />
        <Route path = "/theme1" exact element = {<Theme1 />} />
        <Route path = "/theme2" exact element = {<Theme2 />} />
        <Route path = "/theme3" exact element = {<Theme3 />} />
        <Route path = "/theme4" exact element = {<Theme4 />} />
      </Routes>
    </HashRouter>
  )
}


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

    const navigate = useNavigate();
    async function handleSubmit(e) {
      // Prevent the browser from reloading the page
      e.preventDefault();

      // Read the form data
      const form = e.target;
      const formData = new FormData(form);

      // You can pass formData as a fetch body directly:
      // addUser(formData); // plaintext(?) format (seems less useful)
      // console.log(formData);

      // Or you can work with it as a plain object:
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson); // JSON formatted (seems more useful)
      const result = await validateUser(formJson);

      if(result === "login")
      {
        navigate(`/profile`);
      }
      else
      {
        navigate(`/signup`);
      }

    }

  return (
    <div class = "login_page"> 
      <div class = "login_header">
        <h2>Quotebook</h2>
      </div>
      <div class = "container">
        <form class="login_form" method="post" onSubmit={handleSubmit}>
          <h3>Login</h3>
          <label for="username"></label>
          <input type = "text" id = "username" name = "Username" placeholder = "Your Username" />
          <br />
          <label for = "password"> </label>
          <input type = "password" id = "password" name="Password" placeholder = "Your Password" />
          <br />
          <button class = "login-button">Login</button>
          <p><b>Don't have an account? </b></p>
          <NavLink to = "/signup"> Sign Up</NavLink>
        </form>
      </div>
    </div>
  );
}

function SignUp(){
  const [error,setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    // addUser(formData); // plaintext(?) format (seems less useful)
    // console.log(formData);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    const response = await addUser(formJson);

    if(response.success){
      setSuccess(true);
      setError(null);
      form.reset();
    } else{
      setSuccess(false);
      setError(response.error);
    }
    console.log(formJson); // JSON formatted (seems more useful)
  }

  return (
    <div>
      <div class = "signup_header">
        <h2>Quotebook</h2>
      </div>
      <div class = "container">
        <form class = "signup_form" method="post" onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <label for = "email"></label>
          <input type = "text" id = "email" name = "Email" placeholder = "Your Email" /> <br />
          <label for = "username"></label>
          <input type = "text" id = "username" name = "Username" placeholder = "Create Username" /> <br />
          <label for = "password"></label>
          <input type = "password" id = "password" name = "Password" placeholder = "Create Password" /> <br />
          <label for = "reenter"></label>
          <input type = "password" id = "reenter" name = "Re-enter" placeholder = "Re-enter Password" /> <br />
          <button class = "signup-button">Sign Up</button>
          {error && <p class = "signup-error">{error}</p>}
          {success && <p class = "signup-success">Registration successful!</p>}
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
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Used for redirecting

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // If there's no token, the user is not logged in.
        if (!token) {
          setError('No authorization token found. Please log in.');
          setIsLoading(false);
          // Redirect to login page after a delay
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const response = await fetch('http://localhost:5001/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the JWT in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data. Your session may have expired.'); // Returns error 401 or 422
        }

        const data = await response.json();
        setProfileData(data);

      } catch (err) {
        console.error(err);
        setError(err.message);
        // Clear invalid token from storage
        //localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show a loading message while fetching data
  if (isLoading) {
    return <div className="profile"><h1>Loading Profile...</h1></div>;
  }

  // Show an error message if fetching data failed
  if (error) {
    return <div className="profile" style={{ color: 'red' }}><h1>Error</h1><p>{error}</p></div>;
  }

  return (
    <div class = "profile">
      <h1> Profile </h1>
      <div class = "profile-container">
        <img src = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" alt = "Profile picture" class = "profile-pic"></img>
      </div>
      <div class = "info">
        <div class = "username-follow">
          <p class = "profile-element"> @{profileData.username} </p>
          <span class = "separator">|</span>
          <button class = "follow-button">Follow</button>
        </div>
        <p class = "profile-element"><b>Name:</b> {profileData.name || 'Not set'}</p>
        <p class = "profile-element"><b>Bio:</b> {profileData.bio || 'No bio yet.'}</p>
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
        console.error(err);
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
              <li key={quote.id}>
                <blockquote>"{quote.content}"</blockquote>
                <cite>- {quote.author.name}</cite>
                <button className="saveQuotesBtn">Save</button>
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

function Feed(){
  return(
    <div class="feed-container">
      <div class="theme-container">
          <div class="theme-header">
            <h1 class="theme-heading">More Ideas By Theme...</h1>
          </div>
        <div class="themeBtns">
          <NavLink className="theme1" to="/theme1">Daily Dose of Inspiration</NavLink>
          <NavLink className="theme2" to="/theme2">Morning Motivation</NavLink>
          <NavLink className="theme3" to="/theme3">Creative Sparks</NavLink>
          <NavLink className="theme4" to="/theme4">Life Lessons</NavLink>
        </div>
      </div>

      <div class="post-container">
        <div class="post-box">
          <p class="user-title"> 👤 Reaser_The_Best_Professor_Ever</p>
          <div class="quote">
          Quote will be Posted Here...
          </div>
          <div class="postBtns">
            <button class="likeBtn">👍</button>
            <button class="saveBtn">⛉</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Theme1(){
  
  const[quotes, setQuotes]= useState([]);
  const[isLoading, setIsLoading]= useState(true);
  const[error, setError]= useState(null)

  const query= "inspiration";

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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    }, [query]); // The effect re-runs if the 'query' in the URL changes 

  return(
    <div class="theme1-container">
       {!query.trim() && <h1>Random Quotes</h1>}
       {query.trim() && <h1>Daily Dose of Inspiration...</h1>}

       <div className="results-content">
        {isLoading && <p>Loading quotes...</p>}
        {error && <p className="error-message">{error}</p>}
        {quotes.length > 0 && (
          <ul>
            {quotes.map((quote) => (
              <li key={quote.id} className="theme1LI">
                <blockquote>"{quote.content}"</blockquote>
                <cite>- {quote.author.name}</cite>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Theme2(){

  const[quotes, setQuotes]= useState([]);
  const[isLoading, setIsLoading]= useState(true);
  const[error, setError]= useState(null)

  const query= "Morning";

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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    }, [query]); // The effect re-runs if the 'query' in the URL changes 


  return(
    <div class="theme2-container">
      {!query.trim() && <h1>Random Quotes</h1>}
       {query.trim() && <h1>Morning Motivation...</h1>}

       <div className="results-content">
        {isLoading && <p>Loading quotes...</p>}
        {error && <p className="error-message">{error}</p>}
        {quotes.length > 0 && (
          <ul>
            {quotes.map((quote) => (
              <li key={quote.id} className= "theme2LI">
                <blockquote>"{quote.content}"</blockquote>
                <cite>- {quote.author.name}</cite>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Theme3(){

  const[quotes, setQuotes]= useState([]);
  const[isLoading, setIsLoading]= useState(true);
  const[error, setError]= useState(null)

  const query= "Creativity";

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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    }, [query]); // The effect re-runs if the 'query' in the URL changes 


  return(
    <div class="theme3-container">
      {!query.trim() && <h1>Random Quotes</h1>}
       {query.trim() && <h1>Creative Sparks...</h1>}

       <div className="results-content">
        {isLoading && <p>Loading quotes...</p>}
        {error && <p className="error-message">{error}</p>}
        {quotes.length > 0 && (
          <ul>
            {quotes.map((quote) => (
              <li key={quote.id} className="theme3LI">
                <blockquote>"{quote.content}"</blockquote>
                <cite>- {quote.author.name}</cite>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Theme4(){

  const[quotes, setQuotes]= useState([]);
  const[isLoading, setIsLoading]= useState(true);
  const[error, setError]= useState(null)

  const query= "Lessons";

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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    }, [query]); // The effect re-runs if the 'query' in the URL changes 


  return(
    <div class="theme4-container">
    {!query.trim() && <h1>Random Quotes</h1>}
       {query.trim() && <h1>Life Lessons...</h1>}

       <div className="results-content">
        {isLoading && <p>Loading quotes...</p>}
        {error && <p className="error-message">{error}</p>}
        {quotes.length > 0 && (
          <ul>
            {quotes.map((quote) => (
              <li key={quote.id} className="theme4LI">
                <blockquote>"{quote.content}"</blockquote>
                <cite>- {quote.author.name}</cite>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default App;
