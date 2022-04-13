import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword, updateProfile } from "firebase/auth";
import auth from "../Firebase/firebase.init";
import { useLocation, useNavigate } from "react-router-dom";

// firebase auth
const UseFirebase = () => {
    // state
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // navigate to
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/shop";

    // get user from firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser({});
            }
            setLoading(false);
        });
        return () => unsubscribe;
    }, []);

    // handle login
    const HandleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        const email = e.target.email.value; // from elements property
        const password = e.target.password.value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // check if user is verified
                if (user.emailVerified) {
                    console.log(user);
                    setUser(user);
                    setLoading(false);
                    navigate(from, { replace: true });
                } else {
                    alert("Please verify your email");
                }
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setLoading(false);
            })
    };

    // handle google login
    const HandleGoogleLogin = () => {
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then(result => {
                setUser(result.user);
                setError(null);
                navigate(from, { replace: true });
            })
            .catch((error) => console.error(error))
    }

    // logIn with facebook
    const handleFacebookLogin = () => {
        const facebookProvider = new FacebookAuthProvider();
        signInWithPopup(auth, facebookProvider)
            .then(result => {
                setUser(result.user);
                setError(null);
                navigate(from, { replace: true });
            })
            .catch((error) => console.error(error))
    }

    // logIn with github
    const handleGithubLogin = () => {
        const githubProvider = new GithubAuthProvider();
        signInWithPopup(auth, githubProvider)
            .then(result => {
                setUser(result.user);
                setError(null);
                navigate(from, { replace: true });
            })
            .catch((error) => console.error(error))
    }

    // update user profile
    const updateUserProfile = (fullName) => {
        const user = auth.currentUser;
        updateProfile(user, {
            displayName: fullName
        })
            .then(() => {
            })
            .catch((error) => {
            });
    }

    // verify email
    const verifyEmail = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log("Email sent");
            });
    }

    // handle sign up
    const handleSignUp = (e) => {
        e.preventDefault();
        const email = e.target.email.value; // from elements property
        const userPassword = e.target.firstPassword.value;
        const ConfirmPassword = e.target.ConfirmPassword.value;
        const fullName = e.target.fullName.value;
        let password = '';
        if (userPassword === ConfirmPassword) {
            password = userPassword;
        } else {
            setError("Password and Confirm Password does not match");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed Up
                const user = userCredential.user;
                console.log(user);
                updateUserProfile(fullName)
                setUser(user);
                verifyEmail();
                navigate('/login')
            }
            )
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setError(errorMessage);
                setLoading(false);
            }
            );
    }

    // handle logout
    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // reset password with email
    const handleResetPassword = (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value; // from elements property
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("password reset email sent");
                navigate('/login')
            })
            .catch((error) => {

            });
    }

    // update password
    const handleChangePassword = (e) => {
        e.preventDefault();
        const firstPassword = e.target.firstPassword.value;
        const secondPassword = e.target.secondPassword.value;

        let password = '';
        if (firstPassword === secondPassword) {
            password = firstPassword;
        }
        updatePassword(user, password).then(() => {
            handleLogout();
            navigate('/login')
            // Update successful.
        }).catch((error) => {
            // An error ocurred
            // ...
        });
    }

    return { user, error, loading, HandleLogin, HandleGoogleLogin, handleFacebookLogin, handleGithubLogin, handleSignUp, handleLogout, handleResetPassword, handleChangePassword };
}

export default UseFirebase;