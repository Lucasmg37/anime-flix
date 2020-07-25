import React from "react";

import gokuFlatGif from "../../assets/images/goku-nuvem.gif";

import "./styles.scss";

export default function SplashLoading({show = false}) {
  return (
    <div className={`containerSplashLoading ${show && "showContainer"}`}>
      <div className="content">
        <img src={gokuFlatGif} alt="Goku Loading"/>
      </div>
      <div className="blackOPacity">
        <div className="text">
          Carregando...
        </div>
      </div>
    </div>
  )
}