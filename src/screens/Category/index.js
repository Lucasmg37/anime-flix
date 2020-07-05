import React, {useEffect, useState} from 'react';
import './styles.scss';
import Api from "../../services/Api";
import {FiPackage, FiStar, FiArrowUp, FiArrowDown} from "react-icons/fi";
import Carrossel from "../../components/Carrossel";

export default function Category(props) {

  const {history} = props;

  const [topCategorias, setTopCategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seeAllCategorias, setSeeAllCategorias] = useState(false);
  const [animes, setAnimes] = useState([]);

  const seeAllCategoriasFunction = () => {
    setSeeAllCategorias(true);
    Api.CategoriaService.getCategorias().then(response => {
      setCategorias(response.data);
    })
  };

  useEffect(() => {
    Api.CategoriaService.getTopGlobal(15).then(response => {
      setTopCategorias(response.data);
    });

  }, []);

  let controlAnimes = [];

  const getAnimesByCategoria = (categoria, rest) => {
    Api.AnimeService.getTop(topCategorias[categoria].id).then(response => {

      let data = response.data.map(item => {
        item.categoria = topCategorias[categoria].categoria;
        return item;
      }, topCategorias[categoria].categoria);

      controlAnimes = [...controlAnimes, ...data];

      if (rest > 0) {
        getAnimesByCategoria(categoria + 1, rest - 1);
        return true;
      }

      setAnimes(controlAnimes);
    });

  };

  useEffect(() => {

    if (topCategorias.length > 0) {

      topCategorias.forEach((item, indice) => {
        if (indice > 10) {
          return;
        }

        Api.AnimeService.getTop(item.id).then(response => {
          let data = response.data.map(item2 => {
            item2.categoria = item.categoria;
            return item2;
          }, item.categoria);
          controlAnimes = [...controlAnimes, ...data];
          setAnimes(controlAnimes);
        });
      });

    }

  }, [topCategorias]);

  return (
      <div className='bodyHome'>

        <div className='boxItemHome'>
          <div className='header-session'>
            <FiStar/> <span>{seeAllCategorias ? 'Todas Categorias' : 'As Mais Vistas'}</span>
            {seeAllCategorias === true && (
              <span onClick={() => setSeeAllCategorias(false)} className='link-more-title'>Ver Menos <FiArrowUp/></span>
            )}
            {seeAllCategorias === false && (
              <span onClick={seeAllCategoriasFunction} className='link-more-title'>Ver Todas <FiArrowDown/></span>
            )}
          </div>

          <div className='list-categorias'>
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
                  <li onClick={() => history.push('/search/' + item.id)}>{item.categoria}</li>
                ))}
              </ul>
            )}

          </div>
        </div>

        {topCategorias.length > 0 && topCategorias.map((categoria, index) => {
          if (index > 10) {
            return null
          }

          return (
            <div className='boxItemHome'>
              <div className='headerSession'>
                <FiPackage/> <span>{categoria.categoria}</span>
              </div>

              <Carrossel
                itens={animes.filter(anime => {
                  return anime.categoria === categoria.categoria
                }, categoria.categoria)}
                onClickItem={(value) => history.push('/info/' + value)}
              />
            </div>
          )
        })}

      </div>
  );


}