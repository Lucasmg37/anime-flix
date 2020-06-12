import React from 'react';
import {useHistory} from 'react-router-dom';
import {FiUser, FiLogOut, FiSearch, FiHome, FiArrowLeft, FiList, FiBell} from 'react-icons/fi';
import logo from '../../assets/images/animeflix.svg';

import './styles.scss'

export default function NavBar(props) {

  const history = useHistory();

  const logout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <nav className={`navbar ${props.compact ? 'compact' : null}`} >

    < div className='start'>
      <img onClick={() => history.push('/')} className='item-menu logo' src={logo} alt="Anime Flix"/>

      <div onClick={() => history.push('/')} className='item-menu'>
      <span>Home</span>
      </div>

      <div onClick={() => history.push('/category')} className='item-menu'>
      <span>Categorias</span>
      </div>

      <div onClick={() => history.push('/category')} className='item-menu'>
      <span>Minha Lista</span>
      </div>
      </div>

      <div className='end'>
      <div onClick={() => history.push('/search')} className='item-menu '>
      <FiSearch/>
      </div>

      <div className='item-menu'>
      <span>{props.usuario && props.usuario.nome}</span>
      </div>

      <div onClick={() => history.push('/notification')} className='item-menu'>
      <FiBell/>
      </div>

      <div onClick={logout} className='item-menu'>
      <FiLogOut/>
      <span>Sair</span>
      </div>
      </div>
      </nav>
      )
      }