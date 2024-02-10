// // import React, { useContext, useEffect, useState } from "react";
// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import { UserContext } from "../Context/userContext";
// // import axios from "axios";
// // import Loader from "../Components/Loader";

// // const DeletePost = ({postID: id}) => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [isLoading, setIsLoading] = useState(false);

// //   const currentUser = useContext(UserContext);
// //   const token = currentUser?.token;

// //   // redirect to login page for any user who isn't logged in
// //   useEffect(() => {
// //     if (!token) {
// //       navigate(`/login`);
// //     }
// //   }, []);

// //   const removePost = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await axios.delete(
// //         `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
// //         {
// //           withCredentials: true,
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       if (response.status === 200) {
// //         if (location.pathname === `/myposts/${currentUser.id}`) {
// //           navigate("/");
// //         } else {
// //           navigate("/");
// //         }
// //       }
// //       setIsLoading(false);
// //     } catch (error) {
// //       console.log("Couldn't delete post.", error);
// //     }
// //   };

// //   if (isLoading) {
// //     return <Loader />;
// //   }
  
// //   return (
// //     <Link className="btn sm danger" onClick={() => removePost(id)}>Delete</Link>
// //   );
// // };

// // export default DeletePost;

// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from "../Context/userContext";
// import axios from "axios";
// import Loader from "../Components/Loader";

// const DeletePost = ({ postId }) => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const currentUser = useContext(UserContext);
//   const token = currentUser?.token;

//   const removePost = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.delete(
//         `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.status === 200) {
//         navigate("/");
//       } else {
//         // Handle deletion failure
//         console.error("Failed to delete post");
//       }
//     } catch (error) {
//       // Handle specific error cases and provide descriptive error messages
//       console.error("Error deleting post:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this post?")) {
//       removePost();
//     }
//   };

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <button className="btn sm danger" onClick={handleDelete}>
//       Delete
//     </button>
//   );
// };

// export default DeletePost;

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
