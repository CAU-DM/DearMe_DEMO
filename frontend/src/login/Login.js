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


export function Login({ onLogin }) {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) onLogin(user);
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
        return signInWithPopup(auth, provider)
      })
      .then((data) => {
        console.log(data)
        onLogin(data.user); // App 컴포넌트에 사용자 정보 전달
      })
      .catch((err) => {
        console.log(err);
        onLogin(null); // 오류 발생 시 로그인 정보 없음으로 처리
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
