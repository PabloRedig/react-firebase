import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import "./App.css";

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
    <div className="EditUserForm">
      <h2>Editar Produto</h2>
      <label>Nome:</label>
      <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />

      <label>Quantidade:</label>
      <input type="text" value={editedQuantidade} onChange={(e) => setEditedQuantidade(e.target.value)} />

      <label>Tipo:</label>
      <input type="text" value={editedTipo} onChange={(e) => setEditedTipo(e.target.value)} />

      <label>Valor:</label>
      <input type="text" value={editedValor} onChange={(e) => setEditedValor(e.target.value)} />

      <button className="btn Salvar" onClick={handleSave}>Salvar</button>
      <button className="btn Cancelar" onClick={onCancel}>Cancelar</button>
    </div>
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

        <button onClick={criarUser}>Adicionar Produto</button>
      </div>

      <h1>Estoque</h1>

      <div className="FiltroDeBusca">
        <input
          className="input"
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn" onClick={searchByType}>
          Buscar
        </button>
      </div>


      {(searchTerm ? searchResults : users).map((user) => (
        <div className="produtos" key={user.id}>
          <div className="Card">
            <h2>Produto</h2>
            <div className="produto">
              <span><strong>NOME:</strong> {user.name}</span>
              <span><strong>QUANTIDADE:</strong> {user.quantidade}</span>
              <span><strong>TIPO:</strong> {user.tipo}</span>
              <span><strong>VALOR:</strong> R${user.valor}</span>
            </div>           

              <button  onClick={() => deleteUser(user.id)}>
                Deletar
              </button>

              {/* Botão de Editar */}
              <button onClick={() => startEdit(user)}>
                Editar
              </button>

              {/* Botões de Salvar e Cancelar (somente visíveis durante a edição) */}
              {editUserId === user.id && (
                <EditUserForm
                  user={user}
                  onSave={(editedUser) => {
                    saveEdit(editedUser);
                    cancelEdit();
                  }}
                  onCancel={cancelEdit}
                />
              )}


            </div>
          </div>
        
      ))}
    </div>

  );
}

export default App;


