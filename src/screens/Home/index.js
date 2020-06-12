import React, {useEffect, useState} from 'react';
import './styles.scss';
import NavBar from "../../components/NavBar";
import Api from "../../services/Api";
import {
  FiPlay,
  FiPackage,
  FiList,
  FiStar,
  FiArchive,
  FiArrowRight,
  FaStar,
  FiTag,
  FaPlay,
  FaPlus
} from "react-icons/all";
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
    <>
      <div className='banner'>
        <div className='fosco'/>
        <video src={"http://lucasjunior.com.br/teste.mp4"} muted={true} autoPlay={true} controls={false} loop={true}/>
        <div className='content'>
          <div className='info'>
            <div className='newEpisodes'><FiTag/> Novos Episódios</div>
            <div className='infotop'>
              <span className='star'><FaStar/>  7.2 </span>
              <span>Ano <span className='destaque'>2001</span></span>
              <span>Episódios <span className='destaque'>18</span></span>
            </div>
            <div className='title'>Dragon Ball Z</div>
            <div className='description'>
              Dragon Ball é uma franquia de mídia japonesa criada por Akira Toriyama. Originalmente iniciada com uma
              série de mangá que foi escrita e ilustrada por Toriyama, teve os seus capítulos serializados
            </div>
            <div className='buttonsBanner'>
              <button><FaPlay/>Assistir</button>
              <button><FaPlus/>Adicionar a lista</button>
            </div>
          </div>
          <div className='controllBanner'>
            <div>
              <div className='toBanner'/>
              <div className='toBanner'/>
              <div className='toBanner'/>
            </div>
          </div>
        </div>
      </div>

      <div className='bodyHome'>

        <div className='boxItemHome'>
          <div className='headerSession'>
            <FaStar/> <span>Os mais vistos</span>
          </div>

          <Carrossel
            itens={top}
            onClickItem={(value) => history.push('/info/' + value)}
          />
        </div>

        {recents.length > 0 && (
          <div className='boxItemHome'>
            <div className='headerSession'>
              <FiPlay/> <span>Continuar Assistindo</span>
            </div>

            <Carrossel
              itens={recents}
              onClickItem={(value) => history.push('/info/' + value)}
            />
          </div>
        )}

        <div className='boxItemHome'>
          <div className='headerSession'>
            <FiPackage/> <span>Acabaram de chegar</span>
          </div>

          <Carrossel
            itens={newAnimes}
            onClickItem={(value) => history.push('/info/' + value)}
          />
        </div>

        <div className='boxItemHome'>
          <div className='headerSession'>
            <FiList/> <span>Novos Episódios</span>
          </div>

          <Carrossel
            itens={newAnimesEp}
            onClickItem={(value) => history.push('/info/' + value)}
          />
        </div>


      </div>
    </>
  );


}