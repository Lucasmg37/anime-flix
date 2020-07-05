import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import UIinputText from "../../components/UIinputText";
import Poster from "../../components/Poster";

import './styles.scss';

import Api from "../../services/Api";

export default function Search({setMenuTopScroll}) {

  const history = useHistory();
  const gridRef = useRef(null);

  const [search, setSearch] = useState('');
  const [animes, setAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleScroll = function (event) {

    let position = event.target.scrollTop;
    let screen = event.target.clientHeight;

    if (position > 300) {
      setMenuTopScroll(true);
    } else {
      setMenuTopScroll(false);
    }

    let height = gridRef.current.clientHeight - screen;
    let source = height - (2 / 100 * height);

    if (position > source && !loading) {
      setPage(page + 1);
      getAnimes();
    }
  };

  const getAnimes = () => {

    setLoading(true);
    Api.AnimeService.getAnimes(search, [], page).then(response => {

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
  }, [search]);


  return (
    <div className='bodySerch' onScroll={handleScroll}>
      <PerfectScrollbar>
        <form className={`form-search ${search.length > 0 && 'form-search-filled'}`}>
          <UIinputText
            value={search}
            onChange={setSearch}
            placeholder="Escreva o nome de um anime"
          />
        </form>

        <section className={"animesListSearch"}>
          <ul className='grid-animes' ref={gridRef}>
            {animes.length > 0 && animes.map(anime => (
              <Poster key={anime.id} onClick={(id) => history.push("/info/" + id)} anime={anime}/>))}
          </ul>
        </section>
      </PerfectScrollbar>
    </div>
  );
}