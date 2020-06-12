import React, {useEffect, useState} from 'react';
import './styles.scss';
import UIinputText from "../../components/UIinputText";
import UIbutton from "../../components/UIbutton";
import Api from "../../services/Api";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";

export default function Login({history, ...props}) {

    const [imagens, setImagens] = useState([]);
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

        Api.AnimeService.getImages().then(response => {
            setImagens(response.data);
        });
    }, []);

    const setItem = (value, atrr) => {
        let object = usuario;
        object[atrr] = value;
        setUsuario({...usuario, ...object});
    };

    return (
        <div className='container'>

            <div className='fundo-login'>
                <div className='imagens'>
                    {imagens.map(imagem => (
                        <div>
                            <img src={imagem} alt="Imagem de Fundo"/>
                        </div>
                    ))}
                </div>
                <div className='sobre-imagens'/>
            </div>

            <div className='box-center'>
                <div className='text-login'>
                    <div>
                        <h1>+ DE 2000</h1>
                        <h2>Animes esperam por você!</h2>
                        <p>Faça o seu login e curta o conteúdo.</p>
                    </div>
                </div>

                {props.location.pathname.indexOf('/login') >= 0 && (
                    <form onSubmit={loginUser}>
                        <div>
                            <UIinputText
                                placeholder='E-mail'
                                type='email'
                                onChange={(value) => setItem(value, 'email')}
                                value={usuario.email}
                                required={true}
                            />

                            <UIinputText
                                placeholder='Senha'
                                type='password'
                                onChange={(value) => setItem(value, 'senha')}
                                value={usuario.senha}
                                required={true}
                            />
                            <UIbutton>ACESSAR</UIbutton>

                            <div className='criar-conta'>
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
                                value={usuario.email}
                                required={true}
                            />

                            <UIinputText
                                placeholder='Nome'
                                onChange={(value) => setItem(value, 'nome')}
                                value={usuario.nome}
                                required={true}
                            />

                            <UIinputText
                                placeholder='Senha'
                                type='password'
                                onChange={(value) => setItem(value, 'senha')}
                                value={usuario.senha}
                                required={true}
                            />

                            <UIinputText
                                placeholder='Confirmação de Senha'
                                type='password'
                                required={true}
                                onChange={(value) => setItem(value, 'confirmsenha')}
                                value={usuario.confirmsenha}
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