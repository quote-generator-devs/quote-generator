/**
 * Searches for quotes using the Quotable API.
 * @param {string} query - The term to search for (e.g., 'wisdom', 'technology').
 * @returns {Promise<Array>} A promise that resolves to an array of quote objects, unless an error occurs.
 */
export async function searchQuotes(query) {
    const maxQuotes = 10;

    // If the user didn't search for anything, get random quotes
    // Otherwise, search based on user input

    // NOTE: Quote API may need to be changed or we may need to make our own searchable database of quotes if we want to publish this
    const apiUrl =  !query.trim() ? `https://api.quotable.kurokeita.dev/api/quotes/random?limit=${maxQuotes}` : `https://api.quotable.kurokeita.dev/api/quotes/random?limit=${maxQuotes}&query=${query}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data.quotes;

    } catch (error) {
        console.error(error);
        throw new Error("Could not fetch quotes. Please try again later.");
    }
}
