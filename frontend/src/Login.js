import { auth } from "./firebase-config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useState, useEffect } from "react";

function OAuthTest({ onLogin }) {
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? onLogin(user) : onLogin(null);
    });
  }, []);

  function handleGoogleLogin() {
    setPersistence(auth, browserLocalPersistence) // 로그인 정보를 localStorage에 저장
      .then(() => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
      })
      .then((data) => {
        onLogin(data.user); // App 컴포넌트에 사용자 정보 전달
      })
      .catch((err) => {
        console.log(err);
        onLogin(null); // 오류 발생 시 로그인 정보 없음으로 처리
      });
  }

  return (
    // <div className={styles.container}>
    //   <h3 className={styles.title}>DearMe</h3>
    //   <button className={styles.loginButton} onClick={handleGoogleLogin}>
    //     구글로 로그인
    //   </button>
    // </div>
    <div className="login-window">
      <content>
        <img src="logo512.png" alt="Profile" />
        <p>DearMe</p>
        <button onClick={handleGoogleLogin}>
          구글로 로그인
        </button>
      
        {/* <button onClick={onLogin(true)}>임시 login 버튼</button> */}
      </content>
    </div>
  );
}

export default OAuthTest;
