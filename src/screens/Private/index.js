import React, {useEffect, useState} from 'react';
import {Switch, Route} from "react-router-dom";

import Description from "../Description";
import Search from "../Search";
import Home from "../Home";

import './styles.scss';

import Api from "../../services/Api";
import Category from "../Category";
import NavBar from "../../components/NavBar";

export default function Private(props) {

  const [usuario, setUsuario] = useState({});
  const [menuTopScroll, setMenuTopScroll] = useState(false);

  useEffect(() => {
    setMenuTopScroll(false);
    window.addEventListener('scroll', scrollAction)

    Api.UserService.getUser().then(resonse => {
      setUsuario(resonse.data);
    })
  }, []);

  const scrollAction = () => {
    if (window.pageYOffset > window.innerHeight - 100 && !menuTopScroll) {
      setMenuTopScroll(true);
      return;
    }

    setMenuTopScroll(false);
  }

  return (
    <div className='wrapper'>
      <NavBar usuario={usuario} compact={menuTopScroll} {...props} />
      <div className='pageArea'>
        <Switch>
          <Route path="/info/:anime" exact render={({match}) => (
            <Description {...props} match={match} usuario={usuario}/>
          )}/>
          <Route path="/info/:anime/:episode" exact render={({match}) => (
            <Description {...props} match={match} usuario={usuario}/>
          )}/>
          <Route path="/info/:anime/:episode/:link" exact render={({match}) => (
            <Description {...props} match={match} usuario={usuario}/>
          )}/>

          <Route path="/category" exact render={({match}) => (
            <Category {...props} match={match} usuario={usuario}/>
          )}/>

          <Route path="/search" exact render={({match}) => (
            <Search {...props} setMenuTopScroll={setMenuTopScroll} match={match} usuario={usuario}/>
          )}/>


          <Route path="/"
                 exact
                 render={() => (
                   <Home {...props} usuario={usuario}/>
                 )}
          />
        </Switch>
      </div>
    </div>
  );
}