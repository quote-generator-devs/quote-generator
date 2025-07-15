import logo from './logo.svg';
import './App.css';
import {HashRouter, Routes, Route, NavLink} from "react-router-dom"; // used for navigation between pages

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/about-us" exact element={<AboutUs />} />
      </Routes>
    </HashRouter>
  )
}


function NavBar() {
  return (
    <div class="nav">
      <div class="navbar_items">
      <NavLink class="home" to="/">Home</NavLink>
      <NavLink class="feed" to="/feed">Feed</NavLink>
      <NavLink class="activity" to="/activity">Activity</NavLink>
      <NavLink class="saved_quotes" to="/saved-quotes">Saved Quotes</NavLink>
      <NavLink class="profile" to="/profile">Profile</NavLink>
      <NavLink class="about_us" to="/about-us">About Us</NavLink>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div class="main_header">
      <div class="quotebook_box">
        <div class="quotebox_text">
          <h2 class="quotebook_title">Quotebook</h2>
          <p class="subtitles">your mood. your quote.</p>
        </div>


        <div class="homeBtns">
          <button class="loginBtn">Login</button>
          <button class="signUpBtn">Sign Up</button>
        </div>

      </div>

      <div class="searchbar">
        <input type="text" placeholder="🔍 Input your mood here for a quote!" />
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
            <img src="https://placehold.co/400" alt="Image of Bhavana Dakshinamoorthy" />
            <p>Bhavana Dakshinamoorthy</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/400" alt="Image of Noor Diab" />
            <p>Noor Diab</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/400" alt="Image of Daniel Lawler" />
            <p>Daniel Lawler</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/400" alt="Image of Kaden Spencer" />
            <p>Kaden Spencer</p>
          </div>
          <div class="dev">
            <img src="https://placehold.co/400" alt="Image of Shane Thoma" />
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

export default App;
