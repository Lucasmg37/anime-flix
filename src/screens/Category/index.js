import React, {useEffect, useState} from 'react';
import {FaPlay, FaPlus, FiPackage, FiStar, FiMinusCircle, FiPlusCircle} from "react-icons/all";

import Carrossel from "../../components/Carrossel";
import Card from "../../components/Card";
import Slider from "../../components/Slider";
import SplashLoading from "../../components/SplashLoading";

import Api from "../../services/Api";

import './styles.scss';

export default function Category({history}) {

  const [topCategorias, setTopCategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seeAllCategorias, setSeeAllCategorias] = useState(false);
  const [animes, setAnimes] = useState([]);
  const [animesBanner, setAnimesBanner] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function getCategories() {
      try {
        setLoading(true);
        const responseTopGlobal = await Api.CategoriaService.getTopGlobal(16);
        setTopCategorias(responseTopGlobal.data);
      } catch (e) {

      } finally {
        setLoading(false);
      }

      try {
        const responseAllCategories = await Api.CategoriaService.getCategorias();
        setCategorias(responseAllCategories.data);
      } catch (e) {

      }
    }

    getCategories();
  }, []);

  let controlAnimes = [];
  let animesBannerSave = [];

  /**
   * Put data necessary for render Slider in animes
   * @param animes
   * @returns {*}
   */
  const generateContentBanner = animes => {
    animes = animes.map(anime => {
      anime.src = anime.imagem;
      anime.isVideo = false;
      anime.content = <div className='content'>
        <div className='info'>
          <div className='infotop'>
            <span className='star'><FiPackage/> {anime.categoria}</span>
            <span>Ano <span className='destaque'>{anime.ano}</span></span>
            <span>Episódios <span className='destaque'>18</span></span>
          </div>
          <div className='title'>{anime.nome}</div>
          <div className='description'>


          </div>
          <div className='buttonsBanner'>
            <button onClick={() => history.push("/info/" + anime.id)}><FaPlay/>Assistir</button>
            <button><FaPlus/>Adicionar a lista</button>
          </div>
        </div>
      </div>

      return anime;
    });

    return animes;
  }

  /**
   * Search animes from top Categories
   */
  useEffect(() => {
    if (topCategorias.length) {
      topCategorias.forEach(async (item, indice) => {
        if (indice > 10) {
          return;
        }

        try {
          const response = await Api.AnimeService.getTop(item.id);
          let data = response.data.map(item2 => {
            item2.categoria = item.categoria;
            return item2;
          }, item.categoria);
          controlAnimes = [...controlAnimes, ...data];

          // Select the first anime of categories and send to Banner
          let animePutInBanner = data[0];

          let verifiedExists = animesBannerSave.filter(item => {
            return +item.id === +animePutInBanner.id
          });

          if (!verifiedExists.length) {
            animesBannerSave = [...animesBannerSave, animePutInBanner]
          }

          controlAnimes = [...controlAnimes, ...data];
          setAnimes(controlAnimes);
          setAnimesBanner(generateContentBanner(animesBannerSave));
        } catch (e) {

        } finally {

        }
      });
    }
  }, [topCategorias]);

  return (
    <div className='containerCategories'>

      <SplashLoading show={loading}/>

      <Slider
        className={"bannerCategories"}
        items={animesBanner}
      />

      <div className="contentCategories">
        <Card icon={FiStar} title={seeAllCategorias ? 'Todas Categorias' : 'As Mais Vistas'}>
          <div className='listCategories'>
            {seeAllCategorias === false && (
              <ul>
                {topCategorias.map(item => (
                  <li onClick={() => history.push('/search/' + item.id)}>{item.categoria}</li>
                ))}
              </ul>
            )}

            {seeAllCategorias === true && (
              <ul>
                {categorias.map(item => (
                  <li onClick={() => history.push('/category/' + item.id)}>{item.categoria}</li>
                ))}
              </ul>
            )}

          </div>
        </Card>

        <div className='seeAllCAtegories'>
              <span onClick={() => setSeeAllCategorias(!seeAllCategorias)}>
                {seeAllCategorias ? "Ver Menos" : "Ver Todas"}
                {seeAllCategorias ? <FiMinusCircle/> : <FiPlusCircle/>}
              </span>
        </div>

        {topCategorias.length > 0 && topCategorias.map((categoria, index) => {
          if (index > 10) {
            return null
          }

          return (
            <Card icon={FiPackage} title={categoria.categoria}>
              <Carrossel
                itens={animes.filter(anime => {
                  return anime.categoria === categoria.categoria
                }, categoria.categoria)}
                onClickItem={(value) => history.push('/info/' + value)}
              />
            </Card>
          )
        })}
      </div>
    </div>
  );
}