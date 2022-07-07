import React, { useEffect, useState } from "react";

// Component
import Post from "../Post";

// 路由
import { useLocation } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";

// firebase
import { app, firebaseDatabase } from "../../utils/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";

//img
import NotFound from "../../images/NotFound.svg";

const MainPage = () => {
  const [{ user }] = useStateValue();
  const [postsData, setPostsData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // console.log(user);
    const userRef = collection(firebaseDatabase, `users/${user.uid}/focus`);
    const q = query(userRef);
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        // console.log(doc.data().focus);
        if (doc.data().focus.length == 0) {
          setPostsData(null);
        } else {
          const colRef = collection(firebaseDatabase, "posts");
          const q = query(
            colRef,
            where("author.uid", "in", doc.data().focus),
            orderBy("createdAt", "desc")
          );
          onSnapshot(q, (snapshot) => {
            let data = [];
            snapshot.docs.forEach((doc) => {
              data.push({ id: doc.id, data: doc.data() });
            });
            // console.log(data);
            setPostsData(data);
          });
        }
      });
    });
  }, []);

  return (
    <>
      {postsData?.length ? (
        postsData.map((item) => {
          return <Post key={item.id} postId={item.id} postsData={item.data} />;
        })
      ) : (
        <img className="notFound_img" src={NotFound} />
      )}
    </>
  );
};

export default MainPage;
