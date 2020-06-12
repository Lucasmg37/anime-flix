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

  useEffect(() => {
    Api.UserService.getUser().then(resonse => {
      setUsuario(resonse.data);
    })
  }, []);

  return (
    <div className='wrapper'>
      <NavBar back={true} {...props} />
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
            <Search {...props} match={match} usuario={usuario}/>
          )}/>

          <Route path="/search/:categorias" render={({match}) => (
            <Search {...props} match={match} usuario={usuario}/>
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