import { useNavigate, NavLink } from "react-router-dom";
import { validateUser } from '../utils';
import { useAuth } from '../context/AuthContext';
import { useState } from "react";

function Login() {
    const { login } = useAuth();

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
      // Prevent the browser from reloading the page
      e.preventDefault();

      // Read the form data
      const form = e.target;
      const formData = new FormData(form);

      // You can pass formData as a fetch body directly:
      // addUser(formData); // plaintext(?) format (seems less useful)
      // console.log(formData);

      // Or you can work with it as a plain object:
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson); // JSON formatted (seems more useful)
      const result = await validateUser(formJson);

      // If login is successful, navigate user to profile page.
      if(result.status === "login")
      {
        setError(null);
        login(result.access_token, result.user.username);
        navigate(`/profile`);
      }
      else
      {
        setError(result.error || "Invalid username or password");
      }

    }

  return (
    <div class = "login_page"> 
      <div class = "login_header">
        <h2>Quotebook</h2>
      </div>
      <div class = "container">
        <form class="login_form" method="post" onSubmit={handleSubmit}>
          <h3>Login</h3>
          <label for="username"></label>
          <input type = "text" id = "username" name = "Username" placeholder = "Your Username" />
          <br />
          <label for = "password"> </label>
          <input type = "password" id = "password" name="Password" placeholder = "Your Password" />
          <br />
          <button class = "login-button">Login</button>
          {error && <p style ={{color: "red"}} >{error}</p>}
          <p><b>Don't have an account? </b></p>
          <NavLink to = "/signup"> Sign Up</NavLink>
        </form>
      </div>
    </div>
  );
}

export default Login;