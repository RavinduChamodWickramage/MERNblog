import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import axios from "axios";
import { UserContext } from "../Context/userContext";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const navigate = useNavigate();
  // const { currentUser } = useContext(UserContext);
  // const token = currentUser?.token;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("name");

  // redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate(`/login`);
    }
  }, [token, navigate]);

  // Fetch current user data (avatar, name, email) when component mounts
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${userId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { name, email, avatar } = response.data;
        setName(name);
        setEmail(email);
        setAvatar(avatar);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [userId, token]);

  // Handle avatar update
  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);

    if (!avatar) return;

    try {
      const postData = new FormData();
      postData.append("avatar", avatar);

      // Send avatar to the backend to update
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAvatar(response?.data.avatar);
    } catch (error) {
      console.log(error);
      setError("Failed to update avatar. Please try again.");
    }
  };

  // Update user details (name, email, password)
  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      userData.append("name", name);
      userData.append("email", email);
      userData.append("currentPassword", currentPassword);
      userData.append("newPassword", newPassword);
      userData.append("confirmNewPassword", confirmNewPassword);

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        userData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/logout");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${userId}`} className="btn">
          My Posts
        </Link>
        <div className="profile__details">
          {/* Avatar Section */}
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              {/* Display current avatar */}
              <img
                src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                alt="Profile Avatar"
              />
            </div>

            {/* Avatar update form */}
            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => {
                  setAvatar(e.target.files[0]);
                  setIsAvatarTouched(true);
                }}
                accept=".png,.jpg,.jpeg"
              />

              <label htmlFor="avatar">
                <FaEdit />
              </label>
            </form>

            {/* Show the update button if avatar has been touched */}
            {isAvatarTouched && (
              <button
                className="profile__avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>

          {/* User Info */}
          <h1>{userName}</h1>

          {/* Form to update user details */}
          <form className="form profile__form" onSubmit={updateUserDetails}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
