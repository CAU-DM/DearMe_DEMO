import { auth } from './firebase-config';
import { useState, useEffect } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
} from 'firebase/auth';
import { RiLogoutBoxRLine, RiUserFollowLine } from 'react-icons/ri';
import styles from './Login.module.css';

function Login({ setUserData }) {
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                fetch('/login_success', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                    }),
                })
                    .then((response) => {
                        if (!response.ok)
                            throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then((data) => {
                        setUserData(user);
                    })
                    .catch((error) => {
                        console.error('Error:', error); // 오류 처리
                    });
            } else {
                setUserData(null);
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
                console.err(err);
                setUserData(null);
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

export function LogoutButton({ userData, windowWidth }) {
    function handleLogout() {
        auth.signOut();
        window.location.reload();
    }
    return (
        <div className={styles.logout_btn}>
            <button onClick={handleLogout}>
                <RiLogoutBoxRLine size={20} />
                <p>{windowWidth > 1080 ? 'Logout' : ''}</p>
            </button>
        </div>
    );
}

export function UserInfo({ userData, windowWidth }) {
    return (
        <div className={styles.logout_btn}>
            <button>
                <RiUserFollowLine size={20} />
                <p>{windowWidth > 1080 ? userData.displayName : ''}</p>
            </button>
        </div>
    );
}

export default Login;
