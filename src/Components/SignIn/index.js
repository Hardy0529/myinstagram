import React, { useState, useEffect } from "react";
import "../LoginPage/LoginPage.css";

// 路由
import { useNavigate } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";

// firebbase
import { app, firebaseDatabase } from "../../utils/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// img
import { SpinningCircles } from "react-loading-icons";

const SignIN = ({ setErrorMessage }) => {
  const [{ user }, dispatch] = useStateValue();
  const auth = getAuth(app);
  const navigate = useNavigate();

  // 欄位
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 狀態
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // test account
    setEmail("test@gmail.com");
    setPassword("Test12345678");
  }, []);

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

        setIsLoading(false);
        navigate(`/loading`);
        // window.location.reload();
      } else {
        const userLocalStorageData = {
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
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

  const onsubmit = async () => {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        userPass(user);
        // setIsLoading(false);
        // dispatch({
        //   type: actionType.SET_USER,
        //   user: user.providerData[0],
        // });
        // localStorage.setItem("user", JSON.stringify(user.providerData[0]));
        // navigate(`/createNewIdentity/${user.uid}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          // 信箱格式不正確
          case "auth/invalid-email":
            setErrorMessage("信箱格式不正確");
            setTimeout(() => {
              setErrorMessage("");
            }, 4000);
            break;

          // 該 email 已被停用
          case "auth/user-disabled":
            setErrorMessage("EMAIL 已被停用");
            setTimeout(() => {
              setErrorMessage("");
            }, 4000);
            break;

          // 信箱不存在
          case "auth/user-not-found":
            setErrorMessage("信箱不存在");
            setTimeout(() => {
              setErrorMessage("");
            }, 4000);
            break;

          // 密碼錯誤
          case "auth/wrong-password":
            setErrorMessage("密碼錯誤");
            setTimeout(() => {
              setErrorMessage("");
            }, 4000);
            break;
        }
        setIsLoading(false);
      });
  };
  return (
    <div>
      <input
        className="logipage__text"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="logipage__text"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login__button" onClick={onsubmit}>
        {isLoading ? <SpinningCircles /> : "登入"}
      </button>
    </div>
  );
};

export default SignIN;
