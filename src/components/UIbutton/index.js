import React from 'react';
import {FiLoader} from "react-icons/all";

import 'sass/UI.scss';

export default function UIbutton({onClick, className, children, loading}) {

  const handleOnClick = e => {
    if (onClick) {
      onClick();
    }
  }

  return (
    <button
      disabled={loading}
      className={`UIbutton ${className} ${loading && "blocked"}`}
      onClick={handleOnClick}
    >
      {!loading ? children : <FiLoader className="loadingButton"/>}
    </button>
  );
}