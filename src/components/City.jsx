import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import './City.css';
//componente de clase
/* class City extends React.Component{
  //constructor -> cuando quiero definir un estado!
  //constructor (props){ super (props) this.state}
  render (){
return(

    
    <div>
            Hlle {params.cityId}
    </div>
)

  }  
}

export default City
 */

//componente de funcion

function City({ city, img }) {
  if (!city) {
    alert("Ciudad Inexistente");
    /* acà podria ir un 404 image return <div>NOsiste</div> */
  }

  //useEffect

  return (
    <div className="cityCard">
      <div className="container">
        <h2>{city.name}</h2>
        <img className="iconoClima" src={"http://openweathermap.org/img/wn/"+city.img+"@2x.png"} width="80" height="80" alt="" />
       
        <div className="info">
          <div>Temperatura: {city.temp && city.temp} ºC</div>
          <div>Clima: {city.weather}</div>
         {/*  {console.log(city)} */}
          <div>Viento: {city.wind} km/h</div>
          <div>Cantidad de nubes: {city.clouds}</div>
          <div>Latitud: {city.latitud}º</div>
          <div>Longitud: {city.longitud}º</div>
          <div>Sensacion: {city.feels}ºC</div>
         {/*  <div>{city.img}</div> */}


        </div>
      </div>
    </div>
  );
}

export default City;
