import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Images/Blog.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../Context/userContext";

const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth > 800);
  const { currentUser } = useContext(UserContext);

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavVisible(false);
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo">
          <img src={Logo} alt="Navbar Logo" onClick={closeNavHandler} />
        </Link>
        {isNavVisible && (
          <ul className="nav__menu">
            {currentUser?.id ? (
              <>
                <li>
                  <Link
                    to={`/profile/${currentUser.id}`}
                    onClick={closeNavHandler}
                  >
                    {currentUser.name}
                  </Link>
                </li>
                <li>
                  <Link to="/create" onClick={closeNavHandler}>
                    Create Post
                  </Link>
                </li>
                <li>
                  <Link to="/authors" onClick={closeNavHandler}>
                    Authors
                  </Link>
                </li>
                <li>
                  <Link to="/logout" onClick={closeNavHandler}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/authors" onClick={closeNavHandler}>
                    Authors
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={closeNavHandler}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
        <button className="nav__toggle-btn" onClick={toggleNavVisibility}>
          {isNavVisible ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
