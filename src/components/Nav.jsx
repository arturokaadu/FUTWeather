import React from 'react';
import Logo from '../img/Weather.png'
import SearchBar from './SearchBar.jsx';
import './Nav.css';
import  {Link} from "react-router-dom"

function Nav({onSearch}) {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link to={'/'}>
         <span className="navbar-brand">
          <img id="logoHenry" src={Logo} width="45" height="40" className="d-inline-block align-top" alt="" />
          Weather App
        </span>
        </Link>
        {/* <Link to={'/about'}>About</Link> */}
        

        <SearchBar
          onSearch={onSearch}
        /> 

    </nav>
  );
};

export default Nav;
