import React from "react";
import {FaStar} from "react-icons/all";
import "./styles.scss";

export default function Poster({anime, onClick}) {

  return (
    <li className='itemAnime' onClick={() => onClick(anime.id)}>
      <div className='imageAnime '>
        <img src={anime.imagem} alt="Capa"/>
      </div>
      <div className='infoAnime'>
        <div className='titleAnime'>
          {anime.nome}
        </div>
        <div className='moreInformation'>
          <span className='year'>{anime.ano}</span>
          <span className='myList'>
                  {/*<RiPlayListAddLine/>*/}
                </span>
          <span className='stars'><FaStar/>7.8</span>
        </div>
      </div>
    </li>
  );

}