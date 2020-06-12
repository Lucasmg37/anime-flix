import React, {useEffect, useRef, useState} from 'react';
import ReactNetflixPlayer from 'react-netflix-player';
import './styles.scss';
import Api from "../../services/Api";
import {FiPlay, FiArrowLeft, FiLink, FiZapOff, FiFolderPlus, FiList} from 'react-icons/fi'
import NavBar from "../../components/NavBar";
import PlayerComponent from "../../components/PlayerComponent";
import {FaPlay, FaPlus, FaStar, FiTag} from "react-icons/all";

export default function Description(props) {

  const [episodes, setEpisodes] = useState([]);
  const [episode, setEpisode] = useState({});
  const [anime, setAnime] = useState({});
  const [links, setLinks] = useState([]);
  const [playing, setPlaying] = useState({});
  const [nextEpisode, setNextEpisode] = useState({});

  const {match, history} = props;

  const episodesList = useRef(null);
  const timerRef = useRef(null);

  const savePositionLink = (link, position) => {
    Api.LinkService.savePositionView(link, position);
  }

  const timeUpdate = e => {
    localStorage.setItem("linkcurrent" + playing.id, e.target.currentTime);

    if (e.target.currentTime % 20 >= 0 && e.target.currentTime % 20 < 1) {
      let data = e.target.currentTime;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => savePositionLink(playing.id, data), 5000);

    }
  };

  const toNextVideo = () => {
    let indice = null;
    episodes.forEach((episode, index) => {
      if (+episode.id === +match.params.episode) {
        indice = index;
      }
    }, indice, match.params.episode);

    if (indice !== null && episodes[indice + 1]) {
      history.push('/info/' + anime.id + '/' + episodes[indice + 1].id);
      return;
    }

    history.push('/info/' + anime.id);
  };

  const getDataNextVideo = () => {
    let indice = null;
    episodes.forEach((episode, index) => {
      if (+episode.id === +match.params.episode) {
        indice = index;
      }
    }, indice, match.params.episode);

    if (indice !== null && episodes[indice + 1]) {
      setNextEpisode(episodes[indice + 1])
      return episodes[indice + 1];
    }

    setNextEpisode({})
  }

  const scrollToSelected = () => {
    let element = episodesList.current;
    let selected = element.getElementsByClassName('episode-selected')[0];

    if (selected) {
      let position = selected.offsetTop;
      let height = selected.offsetHeight;
      element.scrollTop = position - (height * 5);
    }
  };


  useEffect(() => {
    if (episodes) {
      scrollToSelected();
      getDataNextVideo();
    }
  }, [episodes])


  useEffect(() => {
    if (match.params.anime) {
      Api.AnimeService.getAnime(match.params.anime).then(response => {

        response.data.episodes.map(episode => {
          episode.playing = +match.params.episode === +episode.id;

          if (!episode.playing) {
            episode.playing = +localStorage.getItem("episodecurrent" + match.params.anime) === +episode.id;
          }

          // episode.nome = episode.nome.toUpperCase().replace(anime.nome.toUpperCase() + ' - ', '');
          // episode.nome = episode.nome.toUpperCase().replace(anime.nome.toUpperCase(), '');
          return episode;
        }, match.params.episode);

        setAnime(response.data);
      });
    }
  }, [match.params.anime]);

  useEffect(() => {
    if (anime.id) {
      Api.EpisodeService.getEpisodes(match.params.anime).then(response => {

        return;

        let replace = response.data.map(episode => {
          episode.playing = +match.params.episode === +episode.id;

          if (!episode.playing) {
            episode.playing = +localStorage.getItem("episodecurrent" + match.params.anime) === +episode.id;
          }

          // episode.nome = episode.nome.toUpperCase().replace(anime.nome.toUpperCase() + ' - ', '');
          // episode.nome = episode.nome.toUpperCase().replace(anime.nome.toUpperCase(), '');
          return episode;
        }, match.params.episode);
        setEpisodes(replace);

        if (match.params.episode) {
          let episodeFilter = replace.filter(episode => {
            return +episode.id === +match.params.episode
          }, match.params.episode);

          setEpisode(episodeFilter[0]);
        }
      });

    }
  }, [anime, match.params.episode]);

  useEffect(() => {

    if (match.params.episode) {
      //Defini o episódoio do usuário
      localStorage.setItem("episodecurrent" + match.params.anime, match.params.episode);

      Api.LinkService.getLinks(match.params.episode).then(response => {
        let bestLink = null;

        if (match.params.link) {
          response.data = response.data.map(item => {
            item.playing = +item.id === +match.params.link;
            return item;
          }, match.params.link);

          let linkPlaying = response.data.filter(link => {
            return +link.id === +match.params.link;
          }, match.params.link);
          bestLink = linkPlaying[0];
          setPlaying(linkPlaying[0]);
        } else {

          //Prioriza Links HD
          response.data.forEach(link => {
            if (link.nome.indexOf('HD') > -1) {
              bestLink = link;
              return;
            }
          }, bestLink);

          if (bestLink !== null) {
            response.data = response.data.map(item => {
              item.playing = +item.id === +bestLink.id;
              return item;
            }, bestLink);

            setPlaying(bestLink);
          } else {
            //Se não tiver HD, usar o primeiro vídeo
            if (response.data.length > 0) {
              response.data[0].playing = true;
              bestLink = response.data[0];
              setPlaying(bestLink);
            }
          }
        }
        setLinks(response.data);

        if (bestLink) {
          //Busca posição do video se o usuário já tiver visto
          let currentVideo = localStorage.getItem("linkcurrent" + bestLink.id) ? localStorage.getItem("linkcurrent" + bestLink.id) : 0;
          // let currentVideo = localStorage.getItem("linkcurrent" + episode.id) ? localStorage.getItem("linkcurrent" + episode.id) : 0;
          let videoElement = document.getElementById("player-episode");
          // videoElement.currentTime = currentVideo >= 5 ? currentVideo - 5 : 0;
        }

      });
    }
  }, [match.params.episode, match.params.link]);

  return (
    <div className=''>

      {anime.id && (
        <div className='bannerMedia'>
          <div className='fosco'/>
          <div className='img'>
            <img src={anime.imagem} alt=""/>
          </div>
          <div className='content'>
            <div className='info'>
              <div className='infotop'>
                <span className='star'><FaStar/>  7.2 </span>
                <span>Ano <span className='destaque'>{anime.ano}</span></span>
                <span>Episódios <span className='destaque'>{anime.episodes ? anime.episodes.length : 0}</span></span>
              </div>
              <ul className='categoriaList'>
                {anime.categorias && anime.categorias.map(categoria => (
                  <li onClick={() => history.push('/search/' + categoria.id)}>{categoria.categoria}</li>
                ))}
              </ul>
              <div className='title'>{anime.nome}</div>
              <div className='description'>
                {anime.description}
              </div>
              <div className='buttonsBanner'>
                <button><FaPlay/>{anime.atualEpisode && anime.atualEpisode.id_episode ? 'Continuar' : 'Assistir'}
                </button>
                <button><FaPlus/>Adicionar a lista</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='bodyDescription'>

        {links.length > 0 && (
          <div style={{
            height: '100vh'
          }}>
            <ReactNetflixPlayer
              title={anime.nome}
              subTitle={episode.nome}

              titleMedia={anime.nome}
              extraInfoMedia={episode.nome}

              backButton={() => history.push('/info/' + anime.id)}
              fullPlayer={false}

              qualities={links}
              onChangeQuality={(id) => {
                history.push('/info/' + anime.id + '/' + episode.id + '/' + id)
              }}

              onCrossClick={() => history.push('/info/' + anime.id)}

              src={playing.endereco}
              autoPlay={true}
              startPosition={localStorage.getItem("linkcurrent" + playing.id) ? localStorage.getItem("linkcurrent" + playing.id) : 0}

              dataNext={
                {title: nextEpisode.nome ? nextEpisode.nome : false}
              }
              onClickItemListReproduction={(id, playing) => history.push('/info/' + anime.id + '/' + id)}
              onNextClick={nextEpisode.id ? toNextVideo : false}
              onEnded={toNextVideo}
              onTimeUpdate={timeUpdate}
              reprodutionList={episodes}
            />
          </div>
        )}

        <div className="episodes">
          <div className='headerSession'>
            <FiList/> <span>Episódios</span>
          </div>

          <div className='listEpisodes'>
            <ul ref={episodesList}>
              {anime.episodes && anime.episodes.length > 0 && anime.episodes.map(episode => (
                <li onClick={() => history.push('/info/' + anime.id + '/' + episode.id)}
                    className={`itemEpisode ${episode.playing && "episodeSelected"}`}>
                  <div className='imagem'>
                    <img src={anime.imagem} alt=""/>
                  </div>
                  <div className='content'>{episode.nome}</div>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>


    </div>
  );
}