import React, {useRef, useState} from 'react';
import {FiArrowRight, FiArrowLeft, RiPlayListAddLine, FaStar} from "react-icons/all";

import './styles.scss';

export default function Carrossel(props) {

  const carrosel = useRef();

  const {itens, onClickItem} = props;
  const [page, setPage] = useState(0);

  return (
    <div className='carrosel'>

      <div onClick={page > 0 ? () => setPage(page - 2) : () => null} className='arrow arrow-left'>
        {page > 0 && (
          <FiArrowLeft/>
        )}
      </div>


      <div onClick={
        (page === 0 || ((itens.length * 250) + (itens.length * 40) - window.innerWidth >= (page * 250) + (page * 40))) ?
          () => setPage(page + 2) : () => null} className='arrow arrow-right'>
        {(page === 0 || ((itens.length * 250) + (itens.length * 40) - window.innerWidth >= (page * 250) + (page * 40))) && (
          <FiArrowRight/>
        )}
      </div>

      <ul className='gridCarrossel'
          ref={carrosel}
          style={
            {
              left:
                (page === 0) ? 0 : ((itens.length * 250) + (itens.length * 40) - window.innerWidth > (page * 250) + (page * 40)) ? -((page * 250) + (page * 40)) : -((itens.length * 250) + (itens.length * 40) + 50 - window.innerWidth)

              // left: page === 0 ? 0 : (itens.length * 250) + (itens.length * 10) <= (page * 250) +  (page * 10) ? -(page * 250)  + (page * 10) : -(itens.length * 250) + (itens.length * 10)  - window.innerWidth,
            }
          }
      >
        {itens.length > 0 && itens.map(item =>
          (<li className='itemAnime' onClick={() => onClickItem(item.id)}>
            <div className='imageAnime '>
              <img src={item.imagem} alt="Capa"/>
            </div>
            <div className='infoAnime'>
              <div className='titleAnime'>
                {item.nome}
              </div>
              <div className='moreInformation'>
                <span className='year'>2018</span>
                <span className='myList'><RiPlayListAddLine/></span>
                <span className='stars'><FaStar/>7.8</span>
              </div>
            </div>
          </li>)
        )}
      </ul>

    </div>
  );

}