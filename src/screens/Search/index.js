import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import UIinputText from "../../components/UIinputText";
import Api from "../../services/Api";
import NavBar from "../../components/NavBar";
import { FiPackage, FiX, FiTag } from "react-icons/fi"
import UIinputTextSelect from "../../components/UIinputTextSelect";

export default function Search(props) {

  const { match } = props;

  const history = useHistory();

  const [search, setSearch] = useState('');
  const [animes, setAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSelect, setCategoriasSelect] = useState([]);
  const [qtdAnimes, setQtdAnimes] = useState(0);

  const addFilterCategoria = item => {

    if (!match.params.categorias) {
      history.push('/search/' + item.id);
      return;
    }

    let routeCategorias = match.params.categorias.split(",");
    routeCategorias = routeCategorias.map(item => {
      return +item;
    });

    if (!routeCategorias.includes(item.id)) {
      routeCategorias = routeCategorias.join(',');
      history.push('/search/' + routeCategorias + "," + item.id);
    }
  };

  const removeCategoria = id => {
    let routeCategorias = match.params.categorias.split(",");
    routeCategorias = routeCategorias.filter(item => {
      return +id !== +item
    }, id);

    routeCategorias = routeCategorias.join(',');
    setCategoriasSelect(categoriasSelect.filter(categoria => {
      return +categoria.id !== +id
    }, id));
    history.push('/search/' + routeCategorias);
  };

  const handleScroll = function (event) {

    let position = event.target.scrollTop;
    let sreen = event.target.clientHeight;
    let height = document.getElementById('grid-animes').clientHeight - sreen;

    let source = height - (1 / 100 * height);

    if (position > source && !loading) {
      setPage(page + 1);
      getAnimes();
    }

  };

  const getAnimes = () => {

    let categorias = match.params.categorias ? match.params.categorias : '';

    setLoading(true);
    Api.AnimeService.getAnimes(search, categorias, page).then(response => {

      setQtdAnimes(response.data["x-total-count"]);

      if (page > 1) {
        setAnimes([...animes, ...response.data.animes]);
        return;
      }

      setAnimes(response.data.animes);

    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    setPage(1);
    getAnimes();
  }, [search, match.params.categorias]);

  useEffect(() => {
    Api.CategoriaService.getCategorias().then(response => {
      setCategorias(response.data);
    })
  }, []);

  useEffect(() => {

    if (match.params.categorias && categorias) {

      let routeCategorias = match.params.categorias.split(",");
      routeCategorias = routeCategorias.map(item => {
        return +item;
      });

      let selectCategorias = categorias.filter(categoria => {
        return routeCategorias.includes(categoria.id)
      }, routeCategorias);

      setCategoriasSelect(selectCategorias);
    }

  }, [match.params.categorias, categorias]);

  return (
    <div className='container-search' onScroll={handleScroll}>

      <NavBar {...props} />

      <div className="search">

        <form className='form-search'>
          <UIinputText
            value={search}
            className='mr-10'
            onChange={setSearch}
            placeholder="Escreva o nome de um anime"
          />
          <UIinputTextSelect
            data={categorias}
            onSelect={addFilterCategoria}
            placeholder='Categorias'
          />
        </form>

        <div className='filters'>
          {categoriasSelect.length > 0 && (
            <div className='categorias-filter'>
              <FiTag className='icon-tag' />
              <ul>
                {categoriasSelect.map(item =>
                  (<div><span>{item.categoria}</span> <FiX onClick={() => removeCategoria(item.id)} /></div>)
                )}
              </ul>
            </div>
          )}
        </div>


        <section>

          <div className='qtd-animes'>
            <FiPackage />
            <span> {qtdAnimes > 1 && qtdAnimes + ' animes encontrados.'} {qtdAnimes === 1 && qtdAnimes + ' anime encontrado.'} {!qtdAnimes && 'Nada encontrado.'}</span>
          </div>

          <ul className='grid-animes' id='grid-animes'>
            {animes.length > 0 && animes.map(anime =>
              (<li className='item-anime' onClick={() => history.push('/info/' + anime.id)}>
                <div className='image-anime '>
                  <img src={anime.imagem} alt="Capa" />
                </div>
                <div className='info'><p>{anime.nome}</p></div>
              </li>)
            )}

          </ul>
        </section>
      </div>
    </div>
  );
}