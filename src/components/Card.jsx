import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';



export default function Card({ min, max, name, img, onClose, id, feels }) {
  return (
    <div className="card">
      <div id="closeIcon" className="row">
        <button onClick={onClose} className="btn btn-sm btn-danger">X</button>
      </div>
      <div className="card-body">
        <Link className='city' to={`/city/${id}`} style={{ textDecoration: 'none' }}>
          <h1 >{name}</h1>
        </Link>
        <div className="row justify-content-center">
          <div className="col-sm-4 col-md-4 col-lg-4 ">
            <img className="iconoClima" src={"https://openweathermap.org/img/wn/" + img + "@2x.png"} width="80" height="80" alt="" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4">
            <p>Min:</p>
            <p>{min}°C</p>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4">
            <p>Max:</p>
            <p>{max}°C</p>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4 col align-self-end">
            <p>Feeling:</p>
            <p>{feels}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};
