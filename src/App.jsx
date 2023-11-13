import {initializeApp }  from "firebase/app";
import { collection, getFirestore, getDocs }  from "firebase/firestore";
import { useEffect, useState } from "react"

const firebaseApp = initializeApp ( {
  apiKey: "AIzaSyCzWFls49ncmBVKD8XSNfNdJ9tDr41fL2w",
  authDomain: "react-firebase-dba81.firebaseapp.com",
  projectId: "react-firebase-dba81",
});


function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const db = getFirestore (firebaseApp);

  const userCollectionRef = collection(db,"users")

  useEffect(() => {
    const getUsers = async () => {      
      const data = await getDocs(userCollectionRef);       
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id })))
    };
    getUsers();

  }, [])

  return (    
    <div>
      <ul>
        {users.map((user) => {
            return(
              <div key={user.id}>
                <li>{user.name} | {user.email}</li>               
              </div>
            )
          })
        }
      </ul>
    </div>
    
  
  );
}

export default App;
