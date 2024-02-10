// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import ReactTimeAgo from 'react-time-ago'
// import TimeAgo from 'javascript-time-ago'
// import en from 'javascript-time-ago/locale/en.json'
// import si from "javascript-time-ago/locale/si.json"

// TimeAgo.addDefaultLocale(en)
// TimeAgo.addLocale(si);

// const PostAuthor = ({ authorID, createdAt }) => {
//   const [author, setAuthor] = useState({});

//   useEffect(() => {
//     const getAuthor = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
//         );
//         setAuthor(response?.data);
//       } catch (error) {
//         console.error("Error fetching author:", error);
//       }
//     };

//     getAuthor();
//   }, [authorID]);

//   return (
//     <Link to={`/posts/users/${author}`} className="post__author">
//     {/* <Link to={`/posts/users/${author?._id}`} className="post__author"> */}
//       <div className="post__author-avatar">
//         <img
//           src={`${process.env.REACT_APP_BASE_URL}/uploads/${author?.avatar}`}
//           alt=""
//         />
//         {/* <img
//           src={`${process.env.REACT_APP_BASE_URL}/uploads/${author?.avatar}`}
//           alt={author?.name}
//         /> */}
//       </div>
//       <div className="post__author-details">
//         <h6>By: {author?.name}</h6>
//         <small>
//           <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
//         </small>
//       </div>
//     </Link>
//   );
// };

// export default PostAuthor;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// // import ReactTimeAgo from "react-time-ago";
// import Loader from "./Loader";
// // import  TimeAgo  from "react-timeago";
// // import en from "javascript-time-ago/locale/en";


// const PostAuthor = ({ authorID, createdAt }) => {
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // TimeAgo.addLocale(en);


//   useEffect(() => {
//     let isMounted = true;

//     const getAuthor = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
//         );
//         if (isMounted) {
//           setAuthor(response?.data);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching author:", error);
//         setLoading(false);
//       }
//     };

//     getAuthor();

//     return () => {
//       isMounted = false;
//     };
//   }, [authorID]);

//   if (loading) {
//     return <Loader />;
//   }

//   if (!author) {
//     return <div>Error: Author not found</div>;
//   }

//   return (
//     <Link to={`/posts/users/${author._id}`} className="post__author">
//       <div className="post__author-avatar">
//         <img
//           src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`}
//           alt={author.name}
//         />
//       </div>
//       <div className="post__author-details">
//         <h6>By: {author.name}</h6>
//         {/* <small> */}
//           {/* <ReactTimeAgo date={new Date(createdAt)} locale="en-US" /> */}
//           {/* <TimeAgo date={new Date(createdAt)} locale="en-US" /> */}
//         {/* </small> */}
//       </div>
//     </Link>
//   );
// };

// export default PostAuthor;

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

