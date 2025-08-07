import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { searchQuotes, getSavedQuotes, saveQuote, removeQuote } from "../utils";
import { useSearchParams, useNavigate } from "react-router-dom";

function QuotesFound() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedQuoteIds, setSavedQuoteIds] = useState(new Map());

  // Hook to read URL query parameters
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  //const {isAuthenticated} = useAuth();

  const {user, token, updateUserData, isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();


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
        if(isAuthenticated){
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
  

  const handleSave = async (quote) => {
    try {

      if(!isAuthenticated)
      {
        setTimeout(() => navigate('/login'), 1000);
        return <div className="profile" style={{ color: 'red' }}><h1>Error</h1><p>No authorization token found. Please log in to view your profile.</p></div>;
      }
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

export default QuotesFound;