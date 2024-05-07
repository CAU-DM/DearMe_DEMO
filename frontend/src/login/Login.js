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
function Login({ onLogin }) {
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user)
      {
        onLogin(user);
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
    setPersistence(auth, browserLocalPersistence) // 로그인 정보를 localStorage에 저장
      .then(() => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
      })
      .then((data) => {
        onLogin(data.user);
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
          className={styles.login_with_google_btn}
          onClick={() => handleGoogleLogin(1)}
          disabled={disabled}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
export default Login;