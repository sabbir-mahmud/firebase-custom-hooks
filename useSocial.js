import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../Firebase/firebase.init";
import generateToken from "./useJwt";
import useUser from "./useUser"

const useSocial = () => {
    const { setError, setUser, setLoading } = useUser();
    // navigate to
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const url = `https://sabbir-assignment-11.herokuapp.com/api/login`;



    const handleGoogleSignIn = () => {
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then(result => {
                setUser(result.user);
                const email = result.user.email;
                generateToken({ url, email });
                toast.info("You are logged in!");
                setLoading(false);
                setError(null);
                navigate(from, { replace: true });
            })
            .catch((error) => console.error(error))

    };

    const handleFacebookLogin = () => {
        const facebookProvider = new FacebookAuthProvider();
        signInWithPopup(auth, facebookProvider)
            .then(result => {
                setUser(result.user);
                const email = result.user.email;
                generateToken({ url, email });
                toast.info("You are logged in!");
                setLoading(false);
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
                const email = result.user.email;
                generateToken({ url, email });
                setUser(result.user);
                setError(null);
                navigate(from, { replace: true });
            })
            .catch((error) => console.error(error))
    }

    // logIn with OAuth/Microsoft
    const handleMicrosoftLogin = () => {
        console.log("OAuth login");
        let microsoftProvider = new OAuthProvider('microsoft.com');
        microsoftProvider.setCustomParameters({
            prompt: "consent",
            display: "popup"
        })
        signInWithPopup(auth, microsoftProvider)
            .then((result) => {
                // User is signed in.
                // IdP data available in result.additionalUserInfo.profile.

                // Get the OAuth access token and ID Token
                const credential = OAuthProvider.credentialFromResult(result);
                const email = credential.email;
                generateToken({ url, email });
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;
                setUser(credential);
            })
            .catch((error) => {
                // Handle error.
                console.log(error);
            });
    };
    // sign in with yahoo
    const yahooLogin = () => {
        const provider = new OAuthProvider('yahoo.com');
        signInWithPopup(auth, provider)
            .then((result) => {
                // IdP data available in result.additionalUserInfo.profile
                // Yahoo OAuth access token and ID token can be retrieved by calling:
                const credential = OAuthProvider.credentialFromResult(result);
                const email = result.user.email;
                generateToken({ url, email });
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;
                console.log(credential);
                setUser(credential);
            })
            .catch((error) => {
                // Handle error.
                console.log(error);
            });
    }

    return { handleFacebookLogin, handleGoogleSignIn, handleMicrosoftLogin, yahooLogin, handleGithubLogin };
};

export default useSocial;