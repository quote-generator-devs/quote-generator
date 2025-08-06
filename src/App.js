import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import { HashRouter, Routes, Route, NavLink, useSearchParams, useNavigate } from 'react-router-dom'; // used for navigation between pages
import { searchQuotes, addUser, validateUser, getUser, saveQuote, getSavedQuotes, removeQuote } from './utils';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
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
  const { isAuthenticated, logout, user } = useAuth();

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
    const { login } = useAuth();

    const navigate = useNavigate();
    const [error, setError] = useState(null);
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

      // If login is successful, navigate user to profile page.
      if(result.status === "login")
      {
        setError(null);
        login(result.access_token, result.user.username);
        navigate(`/profile`);
      }
      else
      {
        setError(result.error || "Invalid username or password");
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
          {error && <p style ={{color: "red"}} >{error}</p>}
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
  const navigate = useNavigate();

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

    // Retrieve passwords from sign-up form.
    const pass = formJson.Password;
    const reenteredPass = formJson["Re-enter"];

    //Checks if passwords are equal before sign up.
    if (pass !== reenteredPass){
      setError("Passwords do not match.");
      return;
    }

    const response = await addUser(formJson);

    if(response.success){
      setSuccess(true);
      setError(null);
      form.reset();

      //If signup is successful, automatically login the user.
      const login = await validateUser({
        Username: formJson.Username,
        Password: formJson.Password,
      });
  
      if (login.status === "login"){
        navigate('/profile');
      }

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
            <img src="/images/Bhavana.jpg" alt="Image of Bhavana Dakshinamoorthy" class="bhavana"/>
            <p>Bhavana Dakshinamoorthy</p>
            <a href = "https://www.linkedin.com/in/bhavana-dakshinamoorthy-874a5a307">
              <img src = "/images/Linkedin-Logo.png" alt= "Image of Linkedin Logo" class = "linkedin"/>
            </a>
            <a href = "https://github.com/bhavana-pixel">
              <img src = "/images/Github-Logo.png" alt="Image of Github Logo" class = "github"/>
            </a>
          </div>
          <div class="dev"> 
            <img src="/images/Noor.jpg" alt="Image of Noor Diab" class="noor" />
            <p>Noor Diab</p>
            <a href = "https://www.linkedin.com/in/noordiab">
              <img src = "/images/Linkedin-Logo.png" alt="Image of Linkedin Logo" class = "linkedin"/>
            </a>
            <a href = "https://github.com/noordiab05">
              <img src = "/images/Github-Logo.png" alt="Image of Github Logo" class = "github"/>
            </a>
          </div>
          <div class="dev">
            <img src="/images/Danny.jpg" alt="Image of Daniel Lawler"  class="danny"/>
            <p>Daniel Lawler</p>
            <a href = "https://www.linkedin.com/in/daniel-lawler-a8381b337/">
              <img src = "/images/Linkedin-Logo.png" alt= "Image of Linkedin Logo" class = "linkedin"/>
            </a>
            <a href = "https://github.com/dannylawler">
              <img src = "/images/Github-Logo.png" alt="Image of Github Logo" class = "github"/>
            </a>
          </div>
          <div class="dev">
            <img src="https://placehold.co/200" alt="Image of Kaden Spencer" class="kaden"/>
            <p>Kaden Spencer</p>
              <img src = "/images/Linkedin-Logo.png" alt= "Image of Linkedin Logo" class = "linkedin"/>         
              <img src = "/images/Github-Logo.png" alt="Image of Github Logo" class = "github"/>
          </div>
          <div class="dev">
            <img src="/images/Shane.jpg" alt="Image of Shane Thoma"  class="shane"/>
            <p>Shane Thoma</p>
            <a href = "https://www.linkedin.com/in/shanethoma/">
              <img src = "/images/Linkedin-Logo.png" alt= "Image of Linkedin Logo" class = "linkedin"/>
            </a>
            <a href = "https://github.com/shane-thoma">
              <img src = "/images/Github-Logo.png" alt="Image of Github Logo" class = "github"/>
            </a>
          </div>
        </div>
      </div>
    
      <div class="dev_description">
        <h2>Our Mission</h2>
        <p>Sharing quotes and quoting each other has been an amusing and exciting part of our college experience. We created Quotebook to continue our tradition and to share this small, but meaningful part of our lives with the world.</p>
      </div>
    </div>
  );
}

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
    setTimeout(() => navigate('/login'), 2000);
    return <div className="profile" style={{ color: 'red' }}><h1>Error</h1><p>No authorization token found. Please log in to view your profile.</p></div>;
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
          <NavLink className="publishedQuotesBtn" to="/publishedQuotes">Published Quotes</NavLink>
          <NavLink className="savedQuotesBtn" to="/saved-quotes">Saved Quotes</NavLink>
          <NavLink className="logOutBtn" to = "/login" onClick = {logout}>Log Out</NavLink>
        </div>
      </div>
    </div>
  );
}


function QuotesFound() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedQuoteIds, setSavedQuoteIds] = useState(new Map());

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
        console.log("Search results:", results.map(q => q.id)); // Log search result IDs


        if (results.length === 0) {
          setError("No quotes found for that term. Try another!");
        } else {
          setQuotes(results);
        }

        //obtain the saved Quotes
        const savedQuotes= await getSavedQuotes();
        console.log("Saved quotes:", savedQuotes.map(q => q.id)); // Log saved quote IDs

        // Build a map: key = content|||author, value = saved quote object
        const savedQuoteMap = new Map();
        savedQuotes.forEach(q => {
          // Try to normalize both content and author.name
            //considers both ways of accessing the content + author
            const key = normalizeKey(q);

          //Creates a map of the key -> quote 
          savedQuoteMap.set(key, q);
        });


        //save them into savedQuoteIds
        setSavedQuoteIds(savedQuoteMap);
        
        
      } catch (err) {
        setError("Could not fetch quotes. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]); // The effect re-runs if the 'query' in the URL changes
  




  const handleSave = async (quote) => {
  try {
    console.log("Attempting to save:", quote);


    const savedQuote = await saveQuote({content: quote.content, author: {name: quote.author.name}});
    
    console.log("Saved quote object:", savedQuote);


    //by returning the savedQuote object, we should also return its ID
    if(savedQuote && savedQuote.id)
    {

      //update the map with the savedQuote object
      //this is how the map will look like:
      //"quote content here|||Author Name": { id: 43, content: "...", author: { name: "..." }, ... },
      setSavedQuoteIds(prevMap => {
        const newMap = new Map(prevMap);
        const key = normalizeKey(quote);

        //update with the new savedQuote object
        newMap.set(key, savedQuote);
        return newMap;
      });

    }

  } catch (err) {
    console.error("Failed to save quote:", err);
  }
};



const handleRemove = async (quote) => {
  try {

    await removeQuote(quote);
    console.log(quote.id)
    
    setSavedQuoteIds(prevMap => {
      const newMap = new Map(prevMap);

      // Normalize for both possible structures
      const key = normalizeKey(quote);;
      newMap.delete(key);
      return newMap;
    });


  } catch (err) {
    console.error("Failed to remove quote:", err);
  }
};

const normalizeKey = (quote) => {
  const content = (quote.content || quote.quote || '').trim();
  const author = (quote.author?.name || quote.author || '').trim();
  return `${content}|||${author}`;
};



  return (
    <div className="results-page">
      {!query.trim() && <h1>Random Quotes</h1>}
      {query.trim() && <h1>Results for "{query}"</h1>}

      <div className="results-content">
        {isLoading && <p>Loading quotes...</p>}
        {error && <p className="error-message">{error}</p>}
        {quotes.length > 0 && (
          <ul>
            {quotes.map((quote) => {
            const key = normalizeKey(quote);
            const savedQuote = savedQuoteIds.get(key); // savedQuoteIds is now a Map

            return (
              <li key={quote.id}>
                <blockquote>"{quote.content}"</blockquote>
                <cite>- {quote.author.name}</cite>
                {savedQuote ? (
                  <button
                    className="removeQuotesBtn"
                    onClick={() => handleRemove(savedQuote)}
                  >Remove</button>
                ) : (
                  <button
                    className="saveQuotesBtn"
                    onClick={() => handleSave(quote)}
                  >Save</button>
                )}
              </li>
            );
          })}
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
  const [quotes, setQuotes]= useState([]);
  const [isLoading, setIsLoading]= useState(true);
  const [error, setError]= useState(null);


  const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await getSavedQuotes();
        
        console.log("Quotes from API:", results);
        if (results.length === 0) {
          setQuotes([]);
          setError("No Quotes Saved Yet.");
        } else {
          setQuotes(results);
          setError(null);
        }
      } catch (err) {
        setError("Could not fetch quotes. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
    }, []);
  


   const handleRemoveQuote = async (quote) => {
    await removeQuote(quote);
    
    fetchData(); // Re-fetch the quotes to update the UI
  };


  return (
    <div className = "saved-quotes-container">
      <div className = "saved-quotes-header">
        <h1>Saved Quotes</h1>
      </div>
      <div className = "saved-quotes-body">
        {isLoading && <p>Loading quotes...</p>}
        {error && <p className="error-message">{error}</p>}
        {quotes.length > 0 && (
          <ul>
            {/* The fix is to use the 'index' from the map function as a key */}
            {quotes.map((quote, index) => (
              <li key={index} className="savedQuoteElement">
                <blockquote>"{quote.quote}"</blockquote>
                <cite>- {quote.author}</cite>
                <button onClick= {() => handleRemoveQuote(quote)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
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

      {/*
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
      */}
    
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
