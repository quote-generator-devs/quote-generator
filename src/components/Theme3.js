import { useEffect, useState } from "react";
import { searchQuotes } from "../utils";

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

export default Theme3;