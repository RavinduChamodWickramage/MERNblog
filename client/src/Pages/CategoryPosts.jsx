import React, { useEffect, useState } from "react";
import PostItem from "../Components/PostItem";
import Loader from "../Components/Loader";
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { category } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`
        );
        setPosts(response?.data);
      } catch (error) {
        setError("Error fetching posts. Please try again later.");
        console.error("Error fetching posts:", error);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [category]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {error ? (
        <h2 className="center">{error}</h2>
      ) : posts.length > 0 ? (
        <div>
          <h2 className="center">Posts in {category}</h2><br />
          <div className="container posts__container">
            {posts.map(
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
            )}
          </div>
        </div>
      ) : (
        <h2 className="center">No posts found for {category}</h2>
      )}
    </section>
  );
};

export default CategoryPosts;
