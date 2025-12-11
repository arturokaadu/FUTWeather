import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './containers/App';
import { BrowserRouter as Router } from "react-router-dom";

//se envuelve a la app en router
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Router>
    <App />
  </Router>
);
