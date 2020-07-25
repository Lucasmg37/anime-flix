import React, {useEffect, useState} from 'react';
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";

import Alert from "../../components/Alert";
import UIinputText from "../../components/UIinputText";
import UIbutton from "../../components/UIbutton";

import background from "../../assets/images/skyanime.jpg";
import goku from "../../assets/images/goku.png";
import logo from "../../assets/images/animeflix.svg";

import Api from "../../services/Api";

import './styles.scss';

export default function Login({history, location}) {

  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Login user
   * @param e
   * @returns {Promise<void>}
   */
  const loginUser = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await Api.LoginService.login(user.email, user.password);
      localStorage.setItem('token', response.data.token);
      redirectUser();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send user to last page visited or home page
   */
  const redirectUser = () => {
    let uri = window.location.hash;
    uri = uri.substr(1);
    if (uri) {
      history.push(uri);
      return;
    }
    history.push("/");
  }

  /**
   * Create New User
   * @param e
   * @returns {Promise<void>}
   */
  const signUpUser = async e => {
    e.preventDefault();
    setError("");

    if (user.password !== user.confirmPassword) {
      setError("As senhas não são iguais.");
      return;
    }

    try {
      setLoading(true);
      const response = await Api.SignUpService.signUp(user.email, user.password, user.name);
      setCreateSuccess(user.email)
      history.push('/login');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      redirectUser()
    }
  }, []);

  useEffect(() => {
    setError("");
    setUser({email: createSuccess});
  }, [location.pathname])

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

        {location.pathname.indexOf('/login') >= 0 && (
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

              {!!error && (
                <Alert
                  emoji={"😥"}
                  message={error}
                />
              )}

              {!!createSuccess && !error && (
                <Alert
                  emoji={"😎"}
                  message={`Conta criada com sucesso!`}
                />
              )}

              <UIinputText
                placeholder='E-mail'
                type='email'
                onChange={email => setUser({...user, email})}
                required={true}
                value={user.email}
              />

              <UIinputText
                placeholder='Senha'
                type='password'
                onChange={password => setUser({...user, password})}
                required={true}
              />

              <UIbutton loading={loading}>ACESSAR</UIbutton>

              <div className='createAccount'>
                <a onClick={() => history.push('/signup')}>Criar uma conta</a> <FiArrowRight/>
              </div>

            </div>
          </form>
        )}

        {location.pathname === '/signup' && (
          <form onSubmit={signUpUser}>

            <div className={"infoLogin"}>
              <h2>Um email, uma senha e um nome!</h2>
              <p>Cadastre-se para ter acesso <br/> ao conteúdo. 🎉</p>
            </div>

            <div className="formGroupSignOut">

              {!!error && (
                <Alert
                  emoji={"😥"}
                  message={error}
                />
              )}

              <UIinputText
                placeholder='E-mail'
                type='email'
                onChange={email => setUser({...user, email})}
                required={true}
              />

              <UIinputText
                placeholder='Nome'
                onChange={name => setUser({...user, name})}
                required={true}
              />

              <UIinputText
                placeholder='Senha'
                type='password'
                onChange={password => setUser({...user, password})}
                required={true}
              />

              <UIinputText
                placeholder='Confirmação de Senha'
                type='password'
                required={true}
                onChange={confirmPassword => setUser({...user, confirmPassword})}
              />

              <UIbutton loading={loading}>CADASTRAR</UIbutton>

              <div className='loginUser'>
                <a onClick={() => history.goBack()}>Fazer login</a> <FiArrowLeft/>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
}