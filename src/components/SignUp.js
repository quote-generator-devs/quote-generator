import { useNavigate, NavLink } from "react-router-dom";
import { addUser, validateUser } from "../utils";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function SignUp(){
  const [error,setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    // addUser(formData); // plaintext(?) format (seems less useful)
    // console.log(formData);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());

    // Retrieve passwords from sign-up form.
    const pass = formJson.Password;
    const reenteredPass = formJson["Re-enter"];

    //Checks if passwords are equal before sign up.
    if (pass !== reenteredPass){
      setError("Passwords do not match.");
      return;
    }

    const response = await addUser(formJson);

    if(response.success){
      setSuccess(true);
      setError(null);
      form.reset();

      //If signup is successful, automatically login the user.
      const loginResult = await validateUser({
        Username: formJson.Username,
        Password: formJson.Password,
      });
  
      if (loginResult.status === "login") {
        await login(loginResult.access_token, loginResult.user); //Calls login function and passes in token and username.
        navigate('/profile');
      }

    } else{
      setSuccess(false);
      setError(response.error);
    }
    console.log(formJson); // JSON formatted (seems more useful)
  }

  return (
    <div>
      <div class = "signup_header">
        <h2>Quotebook</h2>
      </div>
      <div class = "container">
        <form class = "signup_form" method="post" onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          {/** 
          <label for = "email"></label>
          <input type = "text" id = "email" name = "Email" placeholder = "Your Email" /> <br />
          */}
          <label for = "username"></label>
          <input type = "text" id = "username" name = "Username" placeholder = "Create Username" /> <br />
          <label for = "password"></label>
          <input type = "password" id = "password" name = "Password" placeholder = "Create Password" /> <br />
          <label for = "reenter"></label>
          <input type = "password" id = "reenter" name = "Re-enter" placeholder = "Re-enter Password" /> <br />
          <button class = "signup-button">Sign Up</button>
          {error && <p class = "signup-error">{error}</p>}
          {success && <p class = "signup-success">Registration successful!</p>}
          <p><b>Already Have an Account?</b></p>
          <NavLink to = "/login"> Login </NavLink>
        </form>
      </div>
    </div>
  );
}

export default SignUp;