/**
 * Searches for quotes using the Quotable API.
 * @param {string} query - The term to search for (e.g., 'wisdom', 'technology').
 * @returns {Promise<Array>} A promise that resolves to an array of quote objects, unless an error occurs.
 */
export async function searchQuotes(query) {
    const maxQuotes = 5;

    // If the user didn't search for anything, get random quotes
    // Otherwise, search based on user input
    const apiUrl = !query.trim() ? `https://api.quotable.io/quotes/random?limit=${maxQuotes}` : `https://api.quotable.io/search/quotes?query=${query}&limit=${maxQuotes}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;

    } catch (error) {
        throw new Error("Could not fetch quotes. Please try again later.");
    }
}
