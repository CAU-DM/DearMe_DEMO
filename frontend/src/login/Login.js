import { auth } from "./firebase-config";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useState, useEffect } from "react";
import styles from "./Login.module.css";
import { RiLogoutBoxRLine } from "react-icons/ri";
function Login({ onLogin, setMessages }) {
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fetch("/login-success", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Success:', data); // 성공적인 결과 처리
            setMessages(JSON.parse(data.messeges));
            return (JSON.parse(data.messeges))
          })
          .then((log) => {
            console.log(log);
            onLogin(user);
          })
          .catch(error => {
            console.error('Error:', error); // 오류 처리
          });
      }
      else {
        onLogin(null);
        setDisabled(false);
      }
    });
  }, []);
  function handleGoogleLogin() {
    setDisabled(true);
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
      })
      .catch((err) => {
        console.log(err);
        onLogin(null);
        auth.signOut();
        setDisabled(false);
      });
  }
  return (
    <div className="login-window">
      <div>
        <img src="logo512.png" alt="Profile" />
        <p>DearMe</p>
        <button
          type="button"
          className={ styles.login_with_google_btn }
          onClick={() => handleGoogleLogin(1)}
          disabled={disabled}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export function LogoutButton({ onLogin, windowWidth }) {
  const btnText = windowWidth > 1080 ? 'Logout' : '';
  function handleLogout() {
    auth.signOut()
      .then(() => {
        onLogin(null)
      })
      .catch((error) => {
        console.error('Sign out error', error);
      });
  }
  return (
    <div className={styles.logout_btn}>
      <button onClick={handleLogout}>
        <RiLogoutBoxRLine size={20}/>
        <p>{ btnText }</p>
      </button>
    </div>
  );
}

export default Login
