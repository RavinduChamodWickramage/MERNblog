// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { UserContext } from "../Context/userContext";
// import axios from "axios";
// import Loader from "../Components/Loader";
// import DeletePost from "./DeletePost";

// const Dashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const {id} = useParams()

//   const navigate = useNavigate();

//   const currentUser = useContext(UserContext);
//   const token = currentUser?.token;

//   // redirect to login page for any user who isn't logged in
//   // useEffect(() => {
//   //   if (!token) {
//   //     navigate(`/login`);
//   //   }
//   // }, []);

//   // useEffect(() => {
//   //   const fetchPosts = async () => {
//   //     setIsLoading(true);
//   //     try {
//   //       const response = await axios.get(
//   //         `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
//   //         {
//   //           withCredentials: true,
//   //           headers: {
//   //             Authorization: `Bearer ${token}`,
//   //           },
//   //         }
//   //       );
//   //       setPosts(response.data);
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //     setIsLoading(false);
//   //   };

//   //   fetchPosts();
//   // }, [id]);

//   useEffect(() => {
//     if (!token) {
//       // Redirect to login page if user is not logged in
//       navigate(`/login`);
//     } else {
//       // Fetch user's posts if user is logged in
//       const fetchPosts = async () => {
//         setIsLoading(true);
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
//             {
//               withCredentials: true,
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setPosts(response.data);
//         } catch (error) {
//           console.log("Error fetching user's posts:", error);
//           // Handle error more specifically and show descriptive message
//         }
//         setIsLoading(false);
//       };

//       fetchPosts();
//     }
//   }, [id, token, navigate]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <section className="dashboard">
//       {posts.length > 0 ? (
//         <div className="container dashboard__container">
//           {posts.map((post) => {
//             return (
//               <article key={post.id} className="dashboard__post">
//                 <div className="dashboard__post-info">
//                   <div className="dashboard__post-thumbnail">
//                     <img src={`${process.env.REACT_APP_BASE_URL}/uploads/${post.thumbnail}`} alt="" />
//                   </div>
//                   <h5>{post.title}</h5>
//                 </div>
//                 <div className="dashboard__post-actions">
//                   <Link to={`/posts/${post._id}`} className="btn sm">
//                     View
//                   </Link>
//                   <Link
//                     to={`/posts/${post._id}/edit`}
//                     className="btn sm primary"
//                   >
//                     Edit
//                   </Link>
//                   <DeletePost postId={post._id} />
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       ) : (
//         <h2 className="center">You have no posts yet</h2>
//       )}
//     </section>
//   );
// };

// export default Dashboard;

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";
import DeletePost from "./DeletePost";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  // const currentUser = useContext(UserContext);
  // const token = currentUser?.token;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.log("Error fetching user's posts:", error);
        // Handle error more specifically and show descriptive message
      }
      setIsLoading(false);
    };

    if (!token) {
      // Redirect to login page if user is not logged in
      navigate(`/login`);
    } else {
      // Fetch user's posts if user is logged in
      fetchPosts();
    }
  }, [id, token, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="dashboard">
      {posts.length > 0 ? (
        <div className="container dashboard__container">
          {posts.map((post) => (
            <article key={post._id} className="dashboard__post">
              <div className="dashboard__post-info">
                <div className="dashboard__post-thumbnail">
                  <img
                    src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
                    alt="Post Thumbnail"
                  />
                </div>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard__post-actions">
                <Link to={`/posts/${post._id}`} className="btn sm">
                  View
                </Link>
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={post._id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">You have no posts yet</h2>
      )}
    </section>
  );
};

export default Dashboard;
