import { NavLink } from "react-router-dom";

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

      <div class="post-container">
        <h1 className= "socialMediaAnnoucement">🚧 Coming Soon With Social Media Update ... 🚧</h1>
      </div>

    </div>
  );
}

export default Feed;