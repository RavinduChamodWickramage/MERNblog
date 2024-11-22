import React, { useEffect, useState } from "react";
import PostItem from "../Components/PostItem";
import Loader from "../Components/Loader";
import axios from "axios";
import { useParams } from "react-router-dom";

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`
        );
        setPosts(response?.data);
      } catch (err) {
        setError("Error fetching author's posts. Please try again later.");
        console.error("Error fetching author's posts:", err);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {error ? (
        <div className="center">{error}</div>
      ) : (
        <div className="container posts__container">
          {posts.length > 0 ? (
            posts.map(
              ({
                _id: id,
                thumbnail,
                category,
                title,
                description,
                creator,
                createdAt,
              }) => (
                <PostItem
                  key={id}
                  postID={id}
                  thumbnail={thumbnail}
                  category={category}
                  title={title}
                  description={description}
                  authorID={creator}
                  createdAt={createdAt}
                />
              )
            )
          ) : (
            <h2 className="center">No posts found</h2>
          )}
        </div>
      )}
    </section>
  );
};

export default AuthorPosts;
