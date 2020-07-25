import React, {useEffect, useRef, useState} from "react";
import "./styles.scss";

export default function Slider(
  {
    height = null, className = "",
    items = [{
      isVideo: false,
      src: "",
      content: <div/>
    }
    ]
  }) {

  const [slideAtual, setSlideAtual] = useState(1)
  const timeout = useRef(null);

  useEffect(() => {
    // Remover marcação se sair do elemento
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(changeSlider, 5000);

  }, [items, slideAtual])


  const changeSlider = () => {
    if (slideAtual >= items.length) {
      setSlideAtual(1);
      return;
    }
    setSlideAtual(slideAtual + 1);
  }

  return (
    <div className={`sliderContainer ${className}`} style={height && {height}}>
      <div className='fosco'/>

      {items.map((item, index) => {
        if (slideAtual === index + 1) {
          return (
            <>
              {item.isVideo ? (
                <video src={item.src} muted={true} autoPlay={true} controls={false} loop={true}/>
              ) : (
                <img src={item.src} alt="Foto Banner"/>
              )
              }
              {item.content}
            </>
          )
        }
      })}



    </div>
  )

}