import React from 'react'
import LoadingGif from '../Images/loading.gif'

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__image">
        <img src={LoadingGif} alt="Loading..." />
      </div>
    </div>
  );
}

export default Loader
