import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import "./App.css";
import Inserir from "./Modulos/InserirDados";
import FiltroDeBusca from "./Modulos/FiltroDeBusca";

// Conexao Banco de dados
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
      {/* MODAL PARA EDITAR O PRODUTO */}
      <div className="EditUserForm">
        <h2>Editar Produto</h2>
        <label>
          <strong>Nome</strong>
        </label>
        <input
          className="input"
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />

        <label>
          <strong>Quantidade</strong>
        </label>
        <input
          className="input"
          type="text"
          value={editedQuantidade}
          onChange={(e) => setEditedQuantidade(e.target.value)}
        />

        <label>
          <strong>Tipo</strong>
        </label>
        <input
          className="input"
          type="text"
          value={editedTipo}
          onChange={(e) => setEditedTipo(e.target.value)}
        />

        <label>
          <strong>Valor</strong>
        </label>
        <input
          className="input"
          type="text"
          value={editedValor}
          onChange={(e) => setEditedValor(e.target.value)}
        />

        <div className="acoes">
          <button className="btn Green" onClick={handleSave}>
            Salvar
          </button>
          <button className="btn Red" onClick={onCancel}>
            Cancelar
          </button>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Const de Edição
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
    setEditedName("");
    setEditedQuantidade("");
    setEditedTipo("");
    setEditedValor("");
  };

  const saveEdit = async (editedUser) => {
    const userDoc = doc(db, "users", editedUser.id);
    await updateDoc(userDoc, editedUser);

    setEditUserId(null);
    setEditedName("");
    setEditedQuantidade("");
    setEditedTipo("");
    setEditedValor("");
    setForceUpdate((prev) => !prev);
  };

  const searchByType = () => {
    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");

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

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, [forceUpdate]);

  async function deleteUser(id) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );

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
            <div className="Card">
              <h2>Produto</h2>
              <div className="produto">
                <span>
                  <strong>NOME:</strong> {user.name}
                </span>
                <span>
                  <strong>QUANTIDADE:</strong> {user.quantidade}
                </span>
                <span>
                  <strong>TIPO:</strong> {user.tipo}
                </span>
                <span>
                  <strong>VALOR:</strong> R${user.valor}
                </span>
              </div>

              <div className="acoes">
                <button className="btn" onClick={() => startEdit(user)}>
                  Editar
                </button>
                <button
                  className="btn Red"
                  onClick={() => deleteUser(user.id)}
                >
                  Deletar
                </button>
              </div>

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
    </div>
  );
}

export default App;
