import React from 'react'
import style from './index.module.scss'

export default function FiltroDeBusca({Busca, setBusca, onclick}) {

    const handleSearchChange = (e) => {
        setBusca(e.target.value);
    };

    return (
        <div class={style.container}>

            <h1>Estoque</h1>
            <input
                className="input"
                type="text"
                placeholder="Buscar"
                value={Busca}
                onChange={handleSearchChange}
            />
            <button className="btn" onClick={onclick}>
                Buscar
            </button>

        </div>
    )
}
