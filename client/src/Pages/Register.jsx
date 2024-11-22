import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validatePasswordStrength = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.password2
    ) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (userData.password !== userData.password2) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!validatePasswordStrength(userData.password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one lowercase letter."
      );
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("password2", userData.password2);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newUser = response.data;

      if (!newUser) {
        setError("Couldn't register user. Please try again.");
        setIsLoading(false);
        return;
      }

      setUserData({
        name: "",
        email: "",
        password: "",
        password2: "",
      });
      setAvatar(null);
      setAvatarPreview(null);
      navigate(`/login`);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError(
          "An error occurred during registration. Please try again later."
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <input type="file" accept="image/*" onChange={changeFileHandler} />
          {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" />}
          <button type="submit" className="btn primary" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
