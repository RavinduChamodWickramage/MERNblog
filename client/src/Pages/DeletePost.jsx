import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";

const DeletePost = ({ postId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const currentUser = useContext(UserContext);
  // const token = currentUser?.token;
  const token = localStorage.getItem("token");

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        navigate(-1);
        // navigate("/");
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      removePost();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <button className="btn sm danger" onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DeletePost;
