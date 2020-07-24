import React from "react";
import "./styles.scss";

export default function Alert({message, emoji}) {
  return (
    <div className="containerAlert">
      <div className="icon">
        {emoji}
      </div>
      <div className="content">
        {message}
      </div>
    </div>
  )
}