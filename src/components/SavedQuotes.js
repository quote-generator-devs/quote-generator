import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getSavedQuotes, removeQuote } from "../utils";
import { useNavigate, NavLink } from "react-router-dom";

function SavedQuotes(){
  const [quotes, setQuotes]= useState([]);
  const [isLoading, setIsLoading]= useState(true);
  const [error, setError]= useState(null);

  //preparing to make sure the user is logged in
  const {user, token, updateUserData, isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();


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

   if (!isAuthenticated) {
    return (
    <div className="profile">
      <h1>Please log in or sign up to access your Saved Quotes!</h1>
      <NavLink className="loginBtn" to="/login">Login</NavLink>
      <NavLink className="signUpBtn" to = "/signup">Sign Up</NavLink>
    </div>);
  }
  

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

export default SavedQuotes;