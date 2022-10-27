import React from "react";
import Logo from "../img/Weather.png";
import SearchBar from "./SearchBar.jsx";
import "./Nav.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const codeMapping = {
  "01d": "clear-sky-day",
  "01n": "clear-sky-night",
};

function Nav({ onSearch }) {
  const [code, setCode] = useState(null); // <-- We'll update this from Search.js
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    setBackgroundImage(codeMapping[`${code}`]);
  }, [code]);

  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link to={"/"}>
        <span className="navbar-brand">
          <img
            id="logoHenry"
            src={Logo}
            width="45"
            height="40"
            className="d-inline-block align-top"
            alt=""
          />
          Weather App
        </span>
      </Link>
      {/* <Link to={'/about'}>About</Link> */}

      <SearchBar onSearch={onSearch} setCode={setCode} />
    </nav>
  );
}

export default Nav;
