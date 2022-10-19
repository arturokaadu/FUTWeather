import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import {BrowserRouter as Router} from "react-router-dom";

//se envuelve a la app en router
ReactDOM.render(
  <Router>
  <App />
  </Router>,
  document.getElementById('root')
);
