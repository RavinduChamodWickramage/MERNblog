import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTimeAgo from "react-timeago"; // Import ReactTimeAgo
import Loader from "./Loader";

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getAuthor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
        );
        if (isMounted) {
          setAuthor(response?.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
        setLoading(false);
      }
    };

    getAuthor();

    return () => {
      isMounted = false;
    };
  }, [authorID]);

  if (loading) {
    return <Loader />;
  }

  if (!author) {
    return <div>Error: Author not found</div>;
  }

  return (
    <Link to={`/posts/users/${author._id}`} className="post__author">
      <div className="post__author-avatar">
        <img
          src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`}
          alt={author.name}
        />
      </div>
      <div className="post__author-details">
        <h6>By: {author.name}</h6>
        <small>
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />{" "}
          {/* Add ReactTimeAgo component */}
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;

