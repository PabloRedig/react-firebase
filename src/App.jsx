import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react"

import DeleteIcon from "./Imgs/Delete.png"

import "./App.css"

//Conexao Banco de dados
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCzWFls49ncmBVKD8XSNfNdJ9tDr41fL2w",
  authDomain: "react-firebase-dba81.firebaseapp.com",
  projectId: "react-firebase-dba81",
});

function App() {

  const [name, setName] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [users, setUsers] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  //Conexao Banco de dados
  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users")

  // Adicionar novo user no BD
  async function criarUser() {

    if (!name || !quantidade || !tipo || !valor) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const user = await addDoc(userCollectionRef, {
      name,
      quantidade,
      tipo,
      valor,
    });
    setForceUpdate((prev) => !prev)

    setName("");
    setQuantidade("");
    setTipo("");
    setValor("");
  }

  // Visualizar user no BD 
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    };
    getUsers();

  }, [forceUpdate]);

  //Deletar User no BD
  async function deleteUser(id) {

    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");

    // Se o usuário clicar em "Cancelar", sai da função sem excluir o usuário
    if (!confirmDelete) {
      return;
    }

    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);

    setForceUpdate((prev) => !prev);
  }

  return (
    <div className="container">
      <div className="inputs">
        <h1>Insira os dados</h1>

        {/** Nome */}
        <input className="input" type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)} />

        {/** Quantiade */}
        <input className="input" type="text"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)} />

        {/** Tipo */}
        <input className="input" type="text"
          placeholder="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)} />

        {/** Valor */}
        <input className="input" type="text"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)} />

        <button className="btn" onClick={criarUser}>Criar</button>
      </div>
      
      <h1>Estoque</h1>

      <div>
        

        {users.map((user) => {
          return (
            <div className="Usuarios" key={user.id}>
              <div className="Card">
                <span>Nome: {user.name}</span>
                <span>Quantidade: {user.quantidade}</span>
                <span>Tipo: {user.tipo}</span>
                <span>Valor: R${user.valor}</span>
                <button className="btnDeletar" onClick={() => deleteUser(user.id)}> Deletar </button>
              </div>
            </div>
          )
        })
        }
      </div>
    </div>


  );
}

export default App;
