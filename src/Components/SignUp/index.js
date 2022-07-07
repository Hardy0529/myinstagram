import React, { useState } from "react";
import "./SignUp.css";

// 路由
import { useNavigate } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";

// firebbase
import { app } from "../../utils/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// img
import { SpinningCircles } from "react-loading-icons";

const SignUp = ({ setErrorMessage }) => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  // 欄位
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const regrex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,18}$/;

  // 狀態
  const [isLoading, setIsLoading] = useState(false);
  const [{ user }, dispatch] = useStateValue();

  const onsubmit = async () => {
    setIsLoading(true);
    if (password.match(regrex) == null) {
      setIsLoading(false);
      setErrorMessage("須為8-18位字母，必須包含小寫字母、大寫字母與數字");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setIsLoading(false);
          const user = userCredential.user;

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
        })

        .catch((error) => {
          setIsLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            // 信箱已存在
            case "auth/email-already-in-use":
              setErrorMessage("信箱已存在");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;
            // 信箱格式不正確
            case "auth/invalid-email":
              setErrorMessage("信箱格式不正確");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;
            // 未啟用「電子郵件/密碼」登入方式
            case "auth/operation-not-allowed":
              setErrorMessage("未啟用「電子郵件/密碼」登入方式");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;
            // 密碼強度不足
            case "auth/weak-password":
              setErrorMessage("密碼強度不足");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;
          }
        });
    }
  };
  return (
    <div>
      <input
        className="logipage__text"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        className="logipage__text"
        // type="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <button className="login__button" onClick={onsubmit}>
        {isLoading ? <SpinningCircles /> : "註冊"}
      </button>
    </div>
  );
};

export default SignUp;
