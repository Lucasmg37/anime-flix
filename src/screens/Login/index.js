import React, {useEffect, useState} from 'react';
import './styles.scss';
import UIinputText from "../../components/UIinputText";
import UIbutton from "../../components/UIbutton";
import Api from "../../services/Api";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";
import background from "../../assets/images/skyanime.jpg";
import goku from "../../assets/images/goku.png";
import logo from "../../assets/images/animeflix.svg";

export default function Login({history, ...props}) {

  const [usuario, setUsuario] = useState({});

  const loginUser = e => {
    e.preventDefault();
    Api.LoginService.login(usuario.email, usuario.senha).then(response => {
      localStorage.setItem('token', response.data.token);

      let uri = window.location.hash;
      uri = uri.substr(1);

      if (uri) {
        history.push(uri);
        return;
      }

      history.push("/");

    })
  };

  const signUpUser = e => {
    e.preventDefault();

    if (usuario.senha !== usuario.confirmsenha) {
      alert("Senhas se diferem entre si.");
      return;
    }

    Api.SignUpService.signUp(
      usuario.email, usuario.senha, usuario.nome
    ).then(() => history.push('/login'));

  };

  useEffect(() => {
    let token = localStorage.getItem('token');

    if (token) {
      let uri = window.location.hash;
      uri = uri.substr(1);

      if (uri) {
        history.push(uri);
        return;
      }
      history.push("/");
    }

  }, []);

  const setItem = (value, atrr) => {
    let object = usuario;
    object[atrr] = value;
    setUsuario({...usuario, ...object});
  };

  return (
    <div className='container'>

      <div className='fundoLogin'>
        <img src={background} alt="Imagem de Fundo"/>
        <div className='sobre-imagens'/>
      </div>

      <div className="topBar">
        <img src={logo} alt={"Logo AnimeFlix"}/>
      </div>

      <div className='boxCenter'>
        <div className='imgPersonagemContainer'>
          <img className={"floatCharacter"} src={goku} alt={"Goku voando"}/>
        </div>

        {props.location.pathname.indexOf('/login') >= 0 && (
          <form onSubmit={loginUser}>

            <div className={"infoLogin"}>
              <h1>
                <span>+ </span>
                <span>DE </span>
                <span> 3000</span>
              </h1>
              <h2>Animes esperam <br/> por você!</h2>
              <p>Faça o seu login e curta o conteúdo. 🎉</p>
            </div>

            <div className={"formGroupLogin"}>
              <UIinputText
                placeholder='E-mail'
                type='email'
                onChange={(value) => setItem(value, 'email')}
                required={true}
              />

              <UIinputText
                placeholder='Senha'
                type='password'
                onChange={(value) => setItem(value, 'senha')}
                required={true}
              />
              <UIbutton>ACESSAR</UIbutton>

              <div className='createAccount'>
                <a onClick={() => history.push('/signup')}>Criar uma conta</a> <FiArrowRight/>
              </div>

            </div>
          </form>
        )}

        {props.location.pathname === '/signup' && (
          <form onSubmit={signUpUser}>
            <div>
              <UIinputText
                placeholder='E-mail'
                type='email'
                onChange={(value) => setItem(value, 'email')}
                required={true}
              />

              <UIinputText
                placeholder='Nome'
                onChange={(value) => setItem(value, 'nome')}
                required={true}
              />

              <UIinputText
                placeholder='Senha'
                type='password'
                onChange={(value) => setItem(value, 'senha')}
                required={true}
              />

              <UIinputText
                placeholder='Confirmação de Senha'
                type='password'
                required={true}
                onChange={(value) => setItem(value, 'confirmsenha')}
              />

              <UIbutton>CADASTRAR</UIbutton>

              <div className='criar-conta'>
                <FiArrowLeft/> <a onClick={() => history.goBack()}>Fazer login</a>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
}