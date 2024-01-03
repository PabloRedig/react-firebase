import React from 'react'
import "./index.css"
import Logo from "../../Imgs/Logo.png"
import iconMenu from "../../Imgs/iconMenu.png"

export default function Cabecalho() {
    return (<>
        <div className="Header">
            <img src={Logo} alt="Logo.." />
            <button className="Menu">
                <img src={iconMenu} alt="icone Menu" />
            </button>
        </div>


        <div className="modal">
            <ul className="menuModal">
                <li>Inserir</li>
                <li>Consultar</li>
                <li>Saida</li>
                <li>Entrada</li>
            </ul>
        </div>
    </>
    )
}
