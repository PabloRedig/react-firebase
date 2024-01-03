import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import "./App.css";
import Inserir from "./Modulos/InserirDados";
import FiltroDeBusca from "./Modulos/FiltroDeBusca";
import Card from "./Modulos/Card";

//Conexao Banco de dados
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCzWFls49ncmBVKD8XSNfNdJ9tDr41fL2w",
  authDomain: "react-firebase-dba81.firebaseapp.com",
  projectId: "react-firebase-dba81",
});

function EditUserForm({ user, onSave, onCancel }) {
  const [editedName, setEditedName] = useState(user.name);
  const [editedQuantidade, setEditedQuantidade] = useState(user.quantidade);
  const [editedTipo, setEditedTipo] = useState(user.tipo);
  const [editedValor, setEditedValor] = useState(user.valor);

  const handleSave = () => {
    onSave({
      id: user.id,
      name: editedName,
      quantidade: editedQuantidade,
      tipo: editedTipo,
      valor: editedValor,
    });
  };

  return (
    <>
      {/* MODAL PARA EDITAR O PROTUDO */}

      <div className="EditUserForm">
        <h2>Editar Produto</h2>
        <label><strong>Nome</strong></label>
        <input className="input" type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />

        <label><strong>Quantidade</strong></label>
        <input className="input" type="text" value={editedQuantidade} onChange={(e) => setEditedQuantidade(e.target.value)} />

        <label><strong>Tipo</strong></label>
        <input className="input" type="text" value={editedTipo} onChange={(e) => setEditedTipo(e.target.value)} />

        <label><strong>Valor</strong></label>
        <input className="input" type="text" value={editedValor} onChange={(e) => setEditedValor(e.target.value)} />

        <div className="acoes">
          <button className="btn Green" onClick={handleSave}>Salvar</button>
          <button className="btn Red" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </>

  );
}

function App() {
  const [name, setName] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [users, setUsers] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para armazenar o tipo de busca
  const [searchResults, setSearchResults] = useState([]); // Novo estado para armazenar os resultados da busca

  //Const de Edição
  const [editUserId, setEditUserId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedQuantidade, setEditedQuantidade] = useState("");
  const [editedTipo, setEditedTipo] = useState("");
  const [editedValor, setEditedValor] = useState("");

  const startEdit = (user) => {
    setEditUserId(user.id);
    setEditedName(user.name);
    setEditedQuantidade(user.quantidade);
    setEditedTipo(user.tipo);
    setEditedValor(user.valor);
  };

  const cancelEdit = () => {
    setEditUserId(null);
    // Limpa os campos de edição
    setEditedName("");
    setEditedQuantidade("");
    setEditedTipo("");
    setEditedValor("");
  };

  const saveEdit = async (editedUser) => {
    // Realize a lógica de atualização no banco de dados
    const userDoc = doc(db, "users", editedUser.id);
    await updateDoc(userDoc, editedUser);

    // Finaliza a edição
    setEditUserId(null);
    // Limpa os campos de edição
    setEditedName("");
    setEditedQuantidade("");
    setEditedTipo("");
    setEditedValor("");
    // Força a atualização da lista de usuários
    setForceUpdate((prev) => !prev);
  };

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
  const userCollectionRef = collection(db, "users");

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
    setForceUpdate((prev) => !prev);

    setName("");
    setQuantidade("");
    setTipo("");
    setValor("");
  }

  // Visualizar user no BD
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
      <Inserir
        name={name}
        setName={setName}
        tipo={tipo}
        setTipo={setTipo}
        quantidade={quantidade}
        setQuantidade={setQuantidade}
        valor={valor}
        setValor={setValor}
        onClick={criarUser}
      />

      <FiltroDeBusca
        busca={searchTerm}
        setBusca={setSearchTerm}
        onclick={searchByType}
      />

      <div className="Box_Produto">
        {(searchTerm ? searchResults : users).map((user) => (
          <div key={user.id}>
            <Card 
              name={user.name}
              quantidade={user.quantidade}
              tipo={user.tipo}
              valor={user.valor}
              startEdit={startEdit}
              user={user}
              deleteUser={deleteUser}      
            />
          </div>
        ))}
      </div>
    </div>

  );
}

export default App;


