import React, {useEffect, useState} from 'react';
import './styles.scss';
import NavBar from "../../components/NavBar";
import Api from "../../services/Api";
import {FiPlay, FiPackage, FiList, FiStar, FiArchive, FiArrowRight} from "react-icons/fi";
import Carrossel from "../../components/Carrossel";

export default function Home(props) {

  const {history} = props;
  const [newAnimes, setNewAnimes] = useState([]);
  const [newAnimesEp, setNewAnimesEp] = useState([]);
  const [recents, setRecents] = useState([]);
  const [top, setTop] = useState([]);
  const [topCategorias, setTopCategorias] = useState([]);

  useEffect(() => {

    Api.CategoriaService.getTopGlobal(10).then(response => {
      setTopCategorias(response.data);
    });

    Api.AnimeService.getNew().then(response => {
      setNewAnimes(response.data);
    });

    Api.AnimeService.getTop().then(response => {
      setTop(response.data);
    });

    Api.EpisodeService.getNew().then(response => {
      setNewAnimesEp(response.data);
    });

    Api.AnimeService.getRecents().then(response => {
      setRecents(response.data);
    });

  }, []);


  return (
    <div className='container-home'>
      <NavBar {...props}/>
      <div className="home">

        {/*<div className='box-item-home'>*/}
        {/*  <div className='header-session'>*/}
        {/*    <FiPackage/> <span>Acabaram de chegar</span>*/}
        {/*  </div>*/}

        {/*  <Carrossel*/}
        {/*    itens={newAnimes}*/}
        {/*    onClickItem={(value) => history.push('/info/' + value)}*/}
        {/*  />*/}
        {/*</div>*/}

        {/*{recents.length > 0 && (*/}
        {/*  <div className='box-item-home'>*/}
        {/*    <div className='header-session'>*/}
        {/*      <FiPlay/> <span>Continuar Assistindo</span>*/}
        {/*    </div>*/}

        {/*    <Carrossel*/}
        {/*      itens={recents}*/}
        {/*      onClickItem={(value) => history.push('/info/' + value)}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}

        {/*<div className='box-item-home'>*/}
        {/*  <div className='header-session'>*/}
        {/*    <FiStar/> <span>Os mais vistos</span>*/}
        {/*  </div>*/}

        {/*  <Carrossel*/}
        {/*    itens={top}*/}
        {/*    onClickItem={(value) => history.push('/info/' + value)}*/}
        {/*  />*/}
        {/*</div>*/}

        {/*<div className='box-item-home'>*/}
        {/*  <div className='header-session'>*/}
        {/*    <FiList/> <span>Novos Episódios</span>*/}
        {/*  </div>*/}

        {/*  <Carrossel*/}
        {/*    itens={newAnimesEp}*/}
        {/*    onClickItem={(value) => history.push('/info/' + value)}*/}
        {/*  />*/}
        {/*</div>*/}

        <div className='box-item-home'>
          <div className='header-session'>
            <FiArchive/> <span>Categorias</span><span onClick={() => history.push("/category")} className='link-more-title'>Ver Todas <FiArrowRight/></span>
          </div>


          <div className='list-categorias'>
            <ul>
              {topCategorias.map(item => (
                <li onClick={() => history.push('/search/' + item.id)}>{item.categoria}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );


}