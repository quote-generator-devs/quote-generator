import bcrypt from 'bcryptjs';

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
            generateQuotes(!query.trim() ? "random" : query);
        }

        const data = await response.json();
        console.log(data);
        return data.quotes;

    } catch (error) {
        console.error(error);
        throw new Error("Could not fetch quotes. Please try again later.");
        generateQuotes(!query.trim() ? "random" : query);
    }
}

export async function addUser(data) {
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(data.Password, saltRounds);
        const secureData = {
            ...data, // copy exisiting data
            Password: hashedPassword //overwrites the plaintext password
        };

        const response = await fetch('http://localhost:5001/user/db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(secureData)
        });

        if (!response.ok) {
            const errorResult = await response.json();
            if(response.status === 409){
                return {success: false, error: "Username already taken"};
            }
            throw new Error(errorResult.error || `Server responded with status: ${response.status}`);
        }

        const result = await response.json();
        return {success: true, result};
        console.log(result);
    }
    catch(err) {
        console.error("Failed to add user:", err);
        return {success: false, error: err.message};
    }
}

export async function validateUser(data) {
    const response = await fetch('http://localhost:5001/user/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });

    const result = await response.json();
    console.log(result);

    if(result.id === "success")
    {
        return "login";
    }

    else
    {
        return "signup";
    }
}
