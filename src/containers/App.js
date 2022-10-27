import React, { useState } from "react";
import { useEffect } from "react";

import "./App.css";
import Nav from "../components/Nav.jsx";
import Cards from "../components/Cards.jsx";
import { Route } from "react-router-dom";
import Card from "../components/Card";
import City from "../components/City";

const apiKey = "b32216f8417048478f9126d87e0fb170";

function App() {
  const [cities, setCities] = useState([]);

  function onClose(id) {
    setCities((oldCities) => oldCities.filter((c) => c.id !== id));
  }
  function onSearch(ciudad) {
    //Llamado a la API del clima
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`
    )
      .then((r) => r.json())
      .then((recurso) => {
        if (recurso.main !== undefined) {
          const ciudad = {
            min: Math.round(recurso.main.temp_min),
            max: Math.round(recurso.main.temp_max),
            img: recurso.weather[0].icon,
            id: recurso.id,
            wind: recurso.wind.speed,
            temp: recurso.main.temp,
            feels: Math.round(recurso.main.feels_like),
            name: recurso.name,
            weather: recurso.weather[0].main,
            clouds: recurso.clouds.all,
            latitud: recurso.coord.lat,
            longitud: recurso.coord.lon,
           
            
          };
          setCities((oldCities) => [...oldCities, ciudad]);
        } else {
          alert("Ciudad no encontrada");
        }
      });
  }
  function onFilter(ciudadId) {
    let ciudad = cities.filter((c) => c.id === parseInt(ciudadId));
    if (ciudad.length > 0) {
      return ciudad[0];
    } else {
      return null;
    }
  }

 
  return (
    <div className="App ">
      <Route path={"/"} render={() => <Nav onSearch={onSearch}  />} />
      <Route
        exact
        path={"/"}
        render={() => <Cards cities={cities} onClose={onClose} />}
      />
      {/*        <Route exact path ={"/about"} render ={()=> <About />} />  |
       */}
      <Route
        path={"/city/:cityId"}
        render={({ match }) => <City city={onFilter(match.params.cityId)} />}
      />
    </div>
  );
}
// tambien se puede usar el params importando el use params

export default App;
// query--> no se declara en el path va en la url
//?name=nombre&lastname=s.lastname
