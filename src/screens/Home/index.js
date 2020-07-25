import React, {useEffect, useState} from 'react';
import './styles.scss';
import Api from "../../services/Api";
import {
  FiPlay,
  FiPackage,
  FiList,
  FaStar,
  FiTag,
  FaPlay,
  FaPlus
} from "react-icons/all";
import Carrossel from "../../components/Carrossel";
import SplashLoading from "../../components/SplashLoading";
import Card from "../../components/Card";
import Slider from "../../components/Slider";

export default function Home(props) {

  const {history} = props;
  const [newAnimes, setNewAnimes] = useState([]);
  const [newAnimesEp, setNewAnimesEp] = useState([]);
  const [recents, setRecents] = useState([]);
  const [top, setTop] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        const responseNewAnimes = await Api.AnimeService.getNew();
        setNewAnimes(responseNewAnimes.data);

        const responseTopAnimes = await Api.AnimeService.getTop();
        setTop(responseTopAnimes.data);

        const responseRecents = await Api.AnimeService.getRecents();
        setRecents(responseRecents.data);

        const responseNewEpisodes = await Api.EpisodeService.getNew();
        setNewAnimesEp(responseNewEpisodes.data);

      } catch (e) {

      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);


  return (
    <div className="containerHome">
      <SplashLoading show={loading}/>

      <Slider
        className={"bannerHome"}
        items={[
          {
            isVideo: true,
            src: "http://lucasjunior.com.br/teste.mp4",
            content: <div className='content'>
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
          }
        ]}
      />

      <div className='bodyHome'>
        <Card icon={FaStar} title="Os mais vistos">
          <Carrossel
            itens={top}
            onClickItem={(value) => history.push('/info/' + value)}
          />
        </Card>

        {recents.length > 0 && (
          <Card icon={FiPlay} title="Continuar Assistindo">
            <Carrossel
              itens={recents}
              onClickItem={(value) => history.push('/info/' + value)}
            />
          </Card>
        )}

        <Card icon={FiPackage} title="Acabaram de chegar">
          <Carrossel
            itens={newAnimes}
            onClickItem={(value) => history.push('/info/' + value)}
          />
        </Card>

        <Card icon={FiList} title="Novos Episódios">
          <Carrossel
            itens={newAnimesEp}
            onClickItem={(value) => history.push('/info/' + value)}
          />
        </Card>

      </div>
    </div>
  );


}