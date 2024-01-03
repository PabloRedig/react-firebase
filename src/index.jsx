import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './Modulos/Login';
import Rodape from './Modulos/Rodapé';
import Cabecalho from './Modulos/Cabecalho';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    

    <Cabecalho /> 
    <App />
    <Rodape />
  </React.StrictMode>
);
