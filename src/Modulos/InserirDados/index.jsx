import React from 'react'
import style from "./index.module.scss"

export default function Inserir({
    name, setName,
    quantidade, setQuantidade,
    tipo, setTipo,
    valor, setValor,
    onClick }) {

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleQuantidadeChange = (e) => {
        setQuantidade(e.target.value);
    };
    const handleTipoChange = (e) => {
        setTipo(e.target.value);
    };
    const handleValorChange = (e) => {
        setValor(e.target.value);
    };

    return (<>
        <div class={style.container}>
            <div class={style.boxInserir}>
                <h1>Insira os dados</h1>

                {/** Nome */}
                <input type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={handleNameChange} />

                {/** Quantiade */}
                <input type="text"
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={handleQuantidadeChange} />

                {/** Tipo */}
                <input type="text"
                    placeholder="Tipo"
                    value={tipo}
                    onChange={handleTipoChange} />

                {/** Valor */}
                <input type="text"
                    placeholder="Valor"
                    value={valor}
                    onChange={handleValorChange} />

                <button onClick={onClick}>Adicionar Produto</button>
            </div>
        </div>
    </>
    )
}
