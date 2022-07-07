import React, { useState } from "react";
// stye
import "./LoginPage.css";

// 路由
import { useNavigate, Link } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";

// firebase
import { app, firebaseDatabase } from "../../utils/firebase";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// Components
import SignIN from "../SignIn";
import SignUp from "../SignUp";

// img
import fb from "../../images/fb.png";
import inst_image from "../../images/9364675fb26a.svg";
import insta_logo from "../../images/logoinsta.png";
import appstore from "../../images/app.png";
import playstore from "../../images/play.png";
import google from "../../images/icon-google-eb3b68c0c83304be350ff0317bdebf72b83a73cadab51463de53f6620fadf204.svg";

const RegisterPage = () => {
  const [{ user }, dispatch] = useStateValue();
  // Firdbase Google && Facebook
  const firebaseAuth = getAuth(app);
  const providerGoogle = new GoogleAuthProvider();
  const providerFacebook = new FacebookAuthProvider();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [activeItem, setAtiveItem] = useState("register");

  // 狀態
  const [errorMessage, setErrorMessage] = useState("");

  const userPass = (user) => {
    const q = query(
      collection(firebaseDatabase, "users"),
      where("uid", "==", user.uid)
    );
    onSnapshot(q, (snapshot) => {
      let data = null;
      snapshot.docs.forEach((doc) => {
        data = doc.data();
      });
      if (data != null) {
        dispatch({
          type: actionType.SET_USER,
          user: data,
        });
        localStorage.setItem("user", JSON.stringify(data));
        navigate(`/posts`);
      } else {
        const userLocalStorageData = {
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.emaiphoneNumberl || "",
          providerId: user.providerData[0].providerId,
        };
        dispatch({
          type: actionType.SET_USER,
          user: userLocalStorageData,
        });
        localStorage.setItem("user", JSON.stringify(userLocalStorageData));
        navigate(`/createNewIdentity/${user.uid}`);
      }
    });
  };
  const loginFacebook = async () => {
    const res = await signInWithPopup(firebaseAuth, providerFacebook)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const credential = FacebookAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        // console.log(user);
        userPass(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };
  const loginGoogle = async () => {
    const res = await signInWithPopup(firebaseAuth, providerGoogle)
      .then((result) => {
        const user = result.user;
        // console.log(user);
        userPass(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <div>
      <div className="container">
        <div className="loginpage">
          <div className="loginpage__main">
            <div className="loginpage__exhibit">
              <img src={inst_image} width="454px" />
            </div>
            <div>
              <div className="loginpage_rightcomponent">
                <img className="loginpage__logo" src={insta_logo} />
                <div className="loginPage__signin">
                  {errorMessage && (
                    <div className="negative message">{errorMessage}</div>
                  )}
                  {activeItem === "register" && (
                    <SignUp setErrorMessage={setErrorMessage} />
                  )}
                  {activeItem === "login" && (
                    <SignIN setErrorMessage={setErrorMessage} />
                  )}

                  <div className="login__ordiv">
                    <div className="login__dividor"></div>
                    <div className="login__or">或</div>
                    <div className="login__dividor"></div>
                  </div>

                  <button
                    className="social__login__button"
                    onClick={loginFacebook}
                  >
                    <div className="login__fb">
                      <img
                        src={fb}
                        width="15px"
                        style={{ marginRight: "8px", marginBottom: "-2px" }}
                      />
                      使用 Facebook 登入
                    </div>
                  </button>
                  <button
                    className="social__login__button"
                    onClick={loginGoogle}
                  >
                    <div className="login__google">
                      <img
                        src={google}
                        width="15px"
                        style={{ marginRight: "8px", marginBottom: "-2px" }}
                      />
                      使用 Google 登入
                    </div>
                  </button>

                  <div className="login_forgt">
                    <Link to={"/accounts/password/reset/"}>忘記密碼?</Link>
                  </div>
                </div>
              </div>

              <div className="loginpage__signupoption">
                {activeItem === "register" && (
                  <div className="loginPage__signup">
                    有帳戶了?
                    <span
                      onClick={() => {
                        setAtiveItem("login");
                        setErrorMessage("");
                      }}
                      style={{
                        fontWeight: "bold",
                        color: "#0395F6",
                        marginLeft: "4px",
                      }}
                    >
                      立即登入
                    </span>
                  </div>
                )}
                {activeItem === "login" && (
                  <div className="loginPage__signin">
                    沒有帳戶?
                    <span
                      onClick={() => {
                        setAtiveItem("register");
                        setErrorMessage("");
                      }}
                      style={{
                        fontWeight: "bold",
                        color: "#0395F6",
                        marginLeft: "4px",
                      }}
                    >
                      立即註冊
                    </span>
                  </div>
                )}
              </div>

              <div className="loginPage__downloadSection">
                <div>下載應用程式</div>
                <div className="loginPage__option">
                  <a href="https://apps.apple.com/app/instagram/id389801252?vt=lo">
                    <img
                      className="loginPage_dwimg"
                      src={appstore}
                      width="136px"
                    />
                  </a>

                  <a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D60CA4520-0954-4FD5-9A2C-E105C36AE114%26utm_content%3Dlo%26utm_medium%3Dbadge">
                    <img
                      className="loginPage_dwimg"
                      src={playstore}
                      width="136px"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
