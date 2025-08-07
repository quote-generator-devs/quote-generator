import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function EditProfile() {
  const { user, token, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.name || '');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    //Throws error if name is empty.
    if (!name.trim()) {
      setError("Please input a name");
      return;
    }

    //Checks for length of bio.
    if (bio.length > 500) {
      setError("Bio too long (max 500 characters)");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/profile/update', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, bio })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(data.message || "Profile updated!");
      updateUserData({ name, bio });

    } catch (err) {
      console.error("Error submitting profile update", err);
      setError(err.message || "Network error. Please try again."); 
    }
  }
  return (
    <div class = "edit-profile-container">
      <div class="edit-profile-header"> 
        <h1>Edit Profile</h1>
      </div>
      <form onSubmit={handleSubmit} class = "edit-profile">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <br></br>
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter your bio (max 500 characters)"
          maxLength={500}
        />
        <br></br>
        <button type="submit">Save Changes</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
}

export default EditProfile;