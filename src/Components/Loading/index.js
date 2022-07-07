import React, { useState, useEffect } from "react";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";

// firebase
import { app, firebaseDatabase, storage } from "../../utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// img
import { BallTriangle } from "react-loading-icons";
const Loading = () => {
  const [{ user }, dispatch] = useStateValue();
  const [render, setRender] = useState(true);

  // console.log(user.uid);

  useEffect(() => {
    setRender(true);
    const q = query(
      collection(firebaseDatabase, "users"),
      where("uid", "==", user.uid)
    );
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
        // console.log(doc.data());
      });
      if (data.length !== null) {
        setTimeout(() => {
          window.location.href = "https://myinstagram-8f250.web.app";
          // window.location.href = " http://localhost:3000/";
        }, 3000);
      }
    });
  }, []);
  return (
    <>
      {render && (
        <div className="loading">
          <BallTriangle />
        </div>
      )}
    </>
  );
};

export default Loading;
