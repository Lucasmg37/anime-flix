import React, {useEffect, useRef, useState} from 'react';
import ReactNetflixPlayer from 'react-netflix-player';
import './styles.scss';
import Api from "../../services/Api";
import {FiList} from 'react-icons/fi'

import {FaPlay, FaPlus, FaStar, FiTag} from "react-icons/all";
import CarrosselComponent from "../../components/CarrosselComponent";
import EpisodeService from "../../services/EpisodeService";

export default function Description({match, history}) {

  const [episode, setEpisode] = useState({});
  const [anime, setAnime] = useState({});
  const [playing, setPlaying] = useState({});

  const [nextEpisode, setNextEpisode] = useState({});
  const [lastEpisode, setLastEpisode] = useState({});

  const episodesList = useRef(null);
  const timerRef = useRef(null);

  const savePositionLink = (link, position) => {
    Api.LinkService.savePositionView(link, position);
  }

  const timeUpdate = e => {
    if (e.target.currentTime % 20 >= 0 && e.target.currentTime % 20 < 1) {
      let data = e.target.currentTime;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => savePositionLink(playing.id, data), 5000);
    }
  };

  const playAnime = () => {

    if (episode.id) {
      history.push("/info/" + anime.id + "/" + episode.id);
      return;
    }

    if (anime.atualEpisode && anime.atualEpisode.id_episode) {
      history.push("/info/" + anime.id + "/" + anime.atualEpisode.id_episode);
      return;
    }

    history.push("/info/" + anime.id + "/" + anime.episodes[0].id);

  }

  const exitPlayer = () => {
    setPlaying({});
    history.push('/info/' + anime.id)
  }

  const toNextVideo = () => {
    let indice = null;
    anime.episodes.forEach((episode, index) => {
      if (+episode.id === +match.params.episode) {
        indice = index;
      }
    }, indice, match.params.episode);

    if (indice !== null && anime.episodes[indice + 1]) {
      history.push('/info/' + anime.id + '/' + anime.episodes[indice + 1].id);
      return;
    }
    history.push('/info/' + anime.id);
  };

  // Busca os dados do próximo episódio
  const getDataNextVideo = (episodes) => {
    let indice = null;
    episodes.forEach((episode, index) => {
      if (+episode.id === +match.params.episode) {
        indice = index;
      }
    });

    if (indice !== null && episodes[indice + 1]) {
      setNextEpisode(episodes[indice + 1])
      return episodes[indice + 1];
    }

    setNextEpisode({})
  }

  const getAnime = async () => {
    let response = await Api.AnimeService.getAnime(match.params.anime);

    // Marca o episódio que o user parou
    if (response.data.atualEpisode) {
      response.data.episodes.map(episode => {
        episode.playing = +response.data.atualEpisode.id_episode === +episode.id;
        return episode;
      });
    }

    // Procura a posição para localizar no carrossel
    let indiceLastViewed = 0;
    response.data.episodes.forEach((episode, indice) => {
      if (episode.playing) {
        indiceLastViewed = indice + 1;
      }
    });

    let pageEpisodeAtual;
    let sizeScreen = window.innerWidth;
    let sizeElement = 350 + 40;
    let elementsPerPage = Math.ceil(sizeScreen / sizeElement < 2 ? 1 : sizeScreen / sizeElement);

    if (elementsPerPage >= indiceLastViewed) {
      pageEpisodeAtual = 0;
    } else {
      pageEpisodeAtual = Math.ceil(indiceLastViewed * sizeElement / sizeScreen) + 1;
    }

    // Salva os dados do último anime vizualizado
    setLastEpisode({
      ...response.data.atualEpisode,
      indiceLastViewed,
      pageEpisodeAtual
    });

    setAnime(response.data);
    return response.data;
  }

  const changeLink = async (id, episode) => {

    // Set Link em execução
    setEpisode({
      ...episode,
      links: episode.links.map(item => {
        item.playing = +item.id === +id;
        return item;
      })
    });

    let link = episode.links.filter(item => {
      return +item.id === +id;
    })[0];

    setPlaying(link);
  }

  const priorizaLinks = (anime) => {
    // Pegar o episodio
    let episodeChange = anime.episodes.filter(episode => {
      return +episode.id === +match.params.episode;
    })[0];

    let links = episodeChange.links
    let bestLink = null;

    //Prioriza Links HD
    links.forEach(link => {
      if (link.nome.indexOf('HD') > -1) {
        bestLink = link;
      }
    }, bestLink);

    if (bestLink !== null) {
      changeLink(bestLink.id, episodeChange)
    } else {
      //Se não tiver HD, usar o primeiro vídeo
      if (anime.episodes.length > 0) {
        changeLink(episodeChange.links[0].id, episodeChange)
      }
    }

  }

  const changeEpisode = async (animeSend) => {

    if (!animeSend) {
      animeSend = anime;
    }

    // Setar o episódio no objeto
    let episodeChange = animeSend.episodes.filter(episode => {
      return +episode.id === +match.params.episode;
    })[0];

    EpisodeService.saveAccessEpisode(match.params.episode);

    getDataNextVideo(animeSend.episodes);
    setEpisode(episodeChange);

    // Selecionar o episódio como atual
    setAnime({
      ...animeSend, episodes: animeSend.episodes.map(episode => {
        episode.playing = +match.params.episode === +episode.id;
        return episode;
      })
    });

    let atualEpisode = animeSend.episodes.filter(episode => {
      return +match.params.episode === +episode.id;
    })[0];

    setLastEpisode({
      ...lastEpisode,
      ...atualEpisode
    });

    // Ao trocar de episódio, abrir o link padrão se não estiver satado na rota o link específico
    if (!match.params.link) {
      priorizaLinks(animeSend);
    }

    return episodeChange;
  }

  const init = async () => {
    let animeSend = null;
    let episodeSend = null;

    // Se alterar o Anime
    if (match.params.anime && +anime.id !== +match.params.anime) {
      animeSend = await getAnime();
    }

    // Se alterar o Episode
    if (match.params.episode) {
      episodeSend = await changeEpisode(animeSend);
    }

    // Se alterar o link
    if (match.params.link && +playing.id !== +match.params.link) {
      await changeLink(match.params.link, episodeSend ? episodeSend : episode);
    }

  }

// Verifica alterações de rota
  useEffect(() => {
    init();
  }, [match.params.anime, match.params.episode, match.params.link]);


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
                {/*<span className='star'><FaStar/>  7.2 </span>*/}
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
                <button
                  onClick={playAnime}>
                  <FaPlay/>{anime.atualEpisode && anime.atualEpisode.id_episode ? 'Continuar' : 'Assistir'}
                </button>
                <button><FaPlus/>Adicionar a lista</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='bodyDescription'>

        {!!playing.id && (
          <div className='player'>
            <ReactNetflixPlayer
              title={anime.nome}
              subTitle={episode.nome}

              titleMedia={anime.nome}
              extraInfoMedia={episode.nome}

              backButton={exitPlayer}
              fullPlayer={true}

              qualities={episode.links}
              onChangeQuality={(id) => {
                history.push('/info/' + anime.id + '/' + episode.id + '/' + id)
              }}

              onCrossClick={exitPlayer}

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
              reprodutionList={anime.episodes}
            />
          </div>
        )}

        {!!anime.episodes && (

          <div className="episodes">
            <div className='headerSession'>
              <FiList/> <span>Episódios</span>
            </div>

            <div className='listEpisodes'>
              <ul ref={episodesList}>
                <CarrosselComponent
                  pageStart={lastEpisode.pageEpisodeAtual}
                  sizeFull={(anime.episodes.length * 350) + (anime.episodes.length * 40)}
                >
                  {anime.episodes && anime.episodes.length > 0 && anime.episodes.map(episode => (
                    <li
                      onClick={episode.links && episode.links.length > 0 ? () => history.push('/info/' + anime.id + '/' + episode.id) : null}
                      className={`itemEpisode ${episode.playing && "episodeSelected"}`}>
                      <div className='imagem'>
                        <img src={anime.imagem} alt=""/>
                      </div>
                      <div className='content'>
                        <div>{episode.nome}</div>
                        {(!episode.links || episode.links.length === 0) && (
                          <p>Episódio temporariamente insdisponível</p>
                        )}
                      </div>
                    </li>
                  ))}
                </CarrosselComponent>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}