import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [user, setUser] = useState(null);

    // true if token exists, false otherwise
    const isAuthenticated = !!token;

    // runs when the token changes (stored, updated, or removed)
    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                localStorage.setItem('accessToken', token);
                try {
                    const response = await fetch('http://localhost:5001/api/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    }
                    else {
                        setToken(null);
                        localStorage.removeItem('accessToken');
                    }
                }
                catch (error) {
                    console.error("Failed to fetch user profile", error);
                    setToken(null);
                }
            }
            else {
                localStorage.removeItem('accessToken');
                setUser(null);
            }
        }

        fetchUser();
    }, [token]);

    // called from login function
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
    }

    // called from logout function
    const logout = () => {
        setToken(null);
        // useEffect above will set user to null
    }

    const value = {
        isAuthenticated,
        user,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// custom hook for easier context use
export const useAuth = () => {
    return useContext(AuthContext);
}