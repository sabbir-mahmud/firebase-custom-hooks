import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import useUser from "./useUser";
import auth from '../../Firebase/firebase.init';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import generateToken from "./useJwt";

const useRegister = () => {
    const { setUser, setLoading } = useUser();
    const navigate = useNavigate();

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
                toast.info("Email sent");
            });
    }

    // handle sign up
    const handleSignUp = (e) => {
        e.preventDefault();
        // from elements property

        const fullName = e.target.fullName.value;
        const email = e.target.email.value;
        const userPassword = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        let password = '';
        if (userPassword === confirmPassword) {
            password = userPassword;
        } else {
            toast.error("Password and Confirm Password does not match");
            return;
        }
        console.log(fullName, email, password);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const url = `https://sabbir-assignment-11.herokuapp.com/api/login`;
                const email = userCredential.user.email;
                // Signed Up
                const user = userCredential.user;
                updateUserProfile(fullName)
                setUser(user);
                // uncomment this line if you want to use jwt
                // generateToken({ url, email }); 
                verifyEmail();
                navigate('/login')
            }
            )
            .catch((error) => {
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoading(false);
            }
            );
    }

    return handleSignUp;

}

export default useRegister;