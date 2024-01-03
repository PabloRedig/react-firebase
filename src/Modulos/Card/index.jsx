import React from 'react'
import style from './index.module.scss'

export default function Card({name, quantidade, tipo, valor, user, startEdit, deleteUser, id} ) {

    return (
        <div class={style.container}>
         
              <h2>Produto</h2>
              <div >
                <span><strong>NOME:</strong>        {name}</span>
                <span><strong>QUANTIDADE:</strong>  {quantidade}</span>
                <span><strong>TIPO:</strong>        {tipo}</span>
                <span><strong>VALOR:</strong> R$    {valor}</span>
              </div>

              <div>
                {/* Botão de Editar */}
                <button  onClick={() => startEdit(user)}>
                  Editar
                </button>
                {/* Botão Deletar */}
                <button  onClick={() => deleteUser(id)}>
                  Deletar
                </button>
              </div>

              {/* Botões de Salvar e Cancelar (somente visíveis durante a edição) */}
             
            
        </div>
    )
}



