import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function EditProfile(){
  const {user, token, updateUserData} = useAuth();

  const[name, setName] = useState(user?.name || '');
  const [error, setError] = useState(null);
  const[success, setSuccess] = useState(null);

  async function handleSubmit(e){
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if(!name.trim()){
      setError("Please input a name");
      return;
    }

    try{
      const response = await fetch('http://localhost:5001/api/profile/change_name', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name})
    });

    const data = await response.json();

    if (!response.ok){
      throw new Error(data.error || "Failed to change name");
    }

    setSuccess(data.message || "Name changed!");
    updateUserData({ name });

    } catch(err){
      console.error("Error submitting name change", err);
      setError(err.message || "Network Error. Please Try Again.");
    }
}
  return (
    <div>
      <div class = "edit-profile-header">
        <h1>Edit Profile</h1>
      </div>
      <form onSubmit = {handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type = "text"
          id = "name"
          value = {name}
          onChange= {(e) => setName(e.target.value)}
          placeholder = "Enter your name"
        />
        <button type = "submit">Save Changes</button>
      </form>

      {error && <p style = {{color:"red"}}>{error}</p>}
      {success && <p style = {{color:'green'}}>{success}</p>}
    </div>
  );
}

export default EditProfile;