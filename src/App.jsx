import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react"

import "./App.css"

//Conexao Banco de dados
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCzWFls49ncmBVKD8XSNfNdJ9tDr41fL2w",
  authDomain: "react-firebase-dba81.firebaseapp.com",
  projectId: "react-firebase-dba81",
});

function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  //Conexao Banco de dados
  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users")

  // Adicionar novo user no BD
  async function criarUser() {
    const user = await addDoc(userCollectionRef, {
      name,
      email,
    })
  }

  // Visualizar user no BD 
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    };
    getUsers();

  }, [])

  //Deletar User no BD
  async function deleteUser(id) {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  }

  return (
    <div className="container">
      <h1>CRUD FIREBASE + REACT </h1>
      <input className="input" type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <input className="input" type="text"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <button className="btn" onClick={criarUser}>Criar Users</button>
      <ul>
        {users.map((user) => {
          return (
            <div className="Usuarios" key={user.id}>
              <li>{user.name} | {user.email}</li>
              <button className="btnDeletar"onClick={() => deleteUser(user.id)}>Deletar</button>
            </div>
          )
        })
        }
      </ul>
    </div>


  );
}

export default App;
