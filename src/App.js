import logo from './logo.svg';
import './App.css';
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; // used for navigation between pages
import { AuthProvider } from './context/AuthContext';
import { NavBar, AboutUs, Activity, EditProfile, Feed, Home, Login, Profile, PublishedQuotes, QuotesFound, SavedQuotes, SignUp, Theme1, Theme2, Theme3, Theme4 } from './components'; // all components (pages and layout pieces) imported as needed

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
          <Route path = "/edit-profile" exact element = {<EditProfile />} />
          <Route path = "/theme1" exact element = {<Theme1 />} />
          <Route path = "/theme2" exact element = {<Theme2 />} />
          <Route path = "/theme3" exact element = {<Theme3 />} />
          <Route path = "/theme4" exact element = {<Theme4 />} />
          <Route path = "/published-quotes" exact element = {<PublishedQuotes />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;