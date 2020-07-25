import React from "react";
import "./styles.scss";

export default function Card({icon, title, children}) {

  return (
    <div className="cardComponent">
      <div className='headerSession'>
        {icon()} <span>{title}</span>
      </div>
      {children}
    </div>
  )

}