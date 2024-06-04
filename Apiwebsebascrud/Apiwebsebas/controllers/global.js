import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js'
import { setDoc, updateDoc, doc, getDoc, getDocs, query, collection, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDcMktDIGIvXU9nuC1QTUBtipBIAZFj6P8",
  authDomain: "apiwebsebas.firebaseapp.com",
  databaseURL: "https://apiwebsebas-default-rtdb.firebaseio.com",
  projectId: "apiwebsebas",
  storageBucket: "apiwebsebas.appspot.com",
  messagingSenderId: "801720119674",
  appId: "1:801720119674:web:36e056ba92e0b2db5126c3",
  measurementId: "G-J0XREEGFZP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const getData = async (id) => await getDoc(doc(db, "datosUsuario", id));

export const updateData = async (
  uid,
  cedula,
  nombre,
  fechaNacimiento,
  direccion,
  telefono
) =>
  updateDoc(doc(db, "datosUsuario", uid), {
      uid,
      cedula,
      nombre,
      fechaNacimiento,
      direccion,
      telefono
  });
  
export { auth };

export const register = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  if (user) {
    await sendEmailVerification(user);
    const cedula = document.getElementById("cedula").value;
    const nombre = document.getElementById("nombre").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    await saveUserData(cedula, nombre, fechaNacimiento, direccion, telefono, email);
  }
  return result;
};

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);

const facebookProvider = new FacebookAuthProvider();

export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);

//metodo de inicio de sesión
export const loginvalidation=(email,password)=>
  signInWithEmailAndPassword(auth, email, password)

export const logout=()=>signOut(auth);

export function userstate() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid)
      await displayUserData(); // Ahora displayUserData está definida en este módulo
    } else {
      window.location.href="./index.html"
    }
  });
}

export const sendResetEmail = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
  

export const deleteAccount = async (email, password) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(user, credential);
    await user.delete();
    alert('Cuenta eliminada exitosamente');
  } catch (error) {
    alert('Error al eliminar la cuenta');
    console.log('Error al eliminar la cuenta: ', error);
  }
};

export const saveUserData = async (cedula, nombre, fechaNacimiento, direccion, telefono, email) => {
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    await setDoc(doc(collection(db, "datosUsuario"), uid), {
      uid: uid,
      cedula,
      nombre,
      fechaNacimiento,
      direccion,
      telefono,
      rol: "usuario"
    });
  } else {
    console.log('No user is signed in.');
  }
};

export const displayUserData = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'datosUsuario', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    console.log(userDocRef)
    console.log(userDocSnap)
    if (userDocSnap.exists()) {
      const userData = await userDocSnap.data();
      console.log(userData)
      // Now you can access the user data and display it in the HTML
      document.getElementById('cedula').value = userData.cedula;
      document.getElementById('nombre').value = userData.nombre;
      document.getElementById('fechaNacimiento').value = userData.fechaNacimiento;
      document.getElementById('direccion').value = userData.direccion;
      document.getElementById('telefono').value = userData.telefono;
      const c = document.getElementById('c')
      const cU = document.getElementById('c-user')
      if(userData.rol == "administrador") {
        
        cU.innerHTML += `<button type="button" id="create-account-btn">Crear Usuario</button>`;
        obtenerDatosAdmin().then( async (userData) => {
          let content = `
          <table>
            <tr>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Celular</th>
              <th></th>
            </tr>`;
          userData.forEach((doc) => {
            let docData = doc.data();
            content += `
            <tr>
              <td>${docData["nombre"]}</td>
              <td>${docData["cedula"]}</td>
              <td><button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${docData["uid"]}">Actualizar</button><button type="button" class="delete-btn" data-id="${docData["uid"]}"">Eliminar</button></td>
            </tr>`;
          });
          content += `</table>`;
          c.innerHTML += content;
          if (exampleModal) {
            exampleModal.addEventListener("show.bs.modal", async (event) => {
              const button = event.relatedTarget;
              const userId = button.getAttribute("data-bs-whatever");
              const modalTitle = exampleModal.querySelector(".modal-title");
              const modalBodyInput =
                exampleModal.querySelector(".modal-body input");
              await getData(userId).then((d) => {
                const saveDataBtn = document.getElementById("save-data-btn");
            const userName = document.getElementById("name-text");
            const cc = document.getElementById("cc-text");
            const address = document.getElementById("address-text");
            const phone = document.getElementById("phone-text");
            const email = document.getElementById("email-text");
            const bornDate = document.getElementById("born-date-text");
                const userD = d.data();
                userName.value = userD.nombre;
                cc.value = userD.cedula;
                address.value = userD.direccion;
                phone.value = userD.telefono;
                email.value = userD.email;
                bornDate.value = userD.fechaNacimiento;
                modalTitle.textContent = `Editar a ${userName.value}`;

                saveDataBtn.addEventListener("click", async () => {
                  await updateData(
                    userId,
                    cc.value,
                    userName.value,
                    bornDate.value,
                    address.value,
                    phone.value,
                  ).then(() => {
                    alert("Se actualizaron los datos");
                    window.location.reload();
                  });
                });
              });
            });
          }
        });
        c.addEventListener("click", (e) => {
          if (e.target.classList.contains("delete-btn")) {
            const id = e.target.dataset.id;
            borrarDoc(id).then(()=> {
              const rowToRemove = c.querySelector(`[data-id="${id}"]`).closest("tr");
              rowToRemove.remove();
            });
          }
        });
      }
    } else {
      console.log('User document does not exist.');
    }
  } else {
    console.log('User is not signed in.');
  }
};
export const obtenerDatosAdmin = async () => await getDocs(query(collection(db, "datosUsuario")))
export const borrarDoc = async (id) => await deleteDoc(doc(db, "datosUsuario", id));
