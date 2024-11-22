import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(null);
    navigate("/login");
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
