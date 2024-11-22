import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`
        );
        setAuthors(response.data);
      } catch (error) {
        setError("Error fetching authors. Please try again later.");
        console.error("Error fetching authors:", error);
      }
      setIsLoading(false);
    };
    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {error ? (
        <div className="center">{error}</div>
      ) : authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <Link key={id} to={`/posts/users/${id}`} className="author">
              <div className="author__avatar">
                <img
                  src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                  alt={name}
                />
              </div>
              <div className="author__info">
                <h4>{name}</h4>
                <p>Posts: {posts}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className="center">No authors found</h2>
      )}
    </section>
  );
};

export default Authors;
