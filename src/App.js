import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Login from "./screens/Login";
import Private from "./screens/Private";
import 'sass/Global.scss';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Login}/>
        <Route path="/" component={Private}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
