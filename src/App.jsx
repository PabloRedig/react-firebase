import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react"

import DeleteIcon from "./Imgs/Delete.png"
import busca from "./Imgs/busca.png"

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
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para armazenar o tipo de busca
  const [searchResults, setSearchResults] = useState([]); // Novo estado para armazenar os resultados da busca

  // Função para buscar usuários pelo tipo
  const searchByType = () => {
    const results = users.filter(
      (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tipo.toLowerCase().includes(searchTerm.toLowerCase())

    );
    setSearchResults(results);
  };

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

        <button onClick={criarUser}>Criar</button>
      </div>

      <h1>Estoque</h1>

      <div className="FiltroDeBusca">
        <input
          className="input"
          type="text"
          placeholder="Buscar por Tipo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="btn" onClick={searchByType}>
          <img className="lupa" src={busca} alt="Lupa" />
        </button>
      </div>

      <div>
        {/* Mostra os resultados da busca ou todos os usuários se não houver busca */}
        {(searchTerm ? searchResults : users).map((user) => (
          <div className="Usuarios" key={user.id}>
            <div className="Card">
              <span>Nome: {user.name}</span>
              <span>Quantidade: {user.quantidade}</span>
              <span>Tipo: {user.tipo}</span>
              <span>Valor: R${user.valor}</span>
              <button className="btnDeletar" onClick={() => deleteUser(user.id)}> Deletar </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


