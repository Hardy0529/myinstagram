import React, { useEffect, useState } from "react";
import "./MyAssetsPage.css";

// 路由
import { useLocation } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";

//firebase
import { firebaseDatabase } from "../../utils/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

// Component
import MyPosts from "../MyPosts";
import MyCollect from "../MyCollect";

// img
import typesetting from "../../images/typesetting.svg";
import NotFound from "../../images/NotFound.svg";
import saved from "../../images/saved.svg";

const MyAssetsPage = () => {
  const [{ user }] = useStateValue();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get("saved");
  // console.log(currentTopic || "posts");

  const [collectedBy, setCollectedBy] = useState(null);
  const [userData, setUserData] = useState("");
  const [active, setActive] = useState(currentTopic || "posts");
  const [postsData, setPostsData] = useState(null);

  // console.log(postsData == false);
  useEffect(() => {
    const colRef = collection(firebaseDatabase, "users");
    const q = query(
      colRef,
      where("username", "==", location.pathname.replace("/posts/", ""))
      // orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      });
      setUserData(data[0]);
      setActive(currentTopic || "posts");
      // console.log(data[0]);
    });
  }, [location]);

  useEffect(() => {
    const colRef = collection(firebaseDatabase, "posts");
    const q = query(
      colRef,
      where("author.username", "==", location.pathname.replace("/posts/", "")),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data() });
      });
      setPostsData(data);
      // console.log(data);
    });
  }, [location]);

  useEffect(() => {
    const colRef = collection(firebaseDatabase, "posts");

    const q = query(
      colRef,
      where("collectedBy", "array-contains", user.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data() });
      });
      // console.log(data);
      setCollectedBy(data);
    });
  }, [active]);

  return (
    <>
      <div className="myAssetsPage-menu">
        <div
          className={`myAssets-posts ${active == "posts" ? "active" : ""}`}
          onClick={() => {
            setActive("posts");
          }}
        >
          <img src={typesetting} />
          <span>貼文</span>
        </div>
        {user.uid == userData.uid && (
          <div
            className={`myAssets-collect  ${
              active == "collect" ? "active" : ""
            }`}
            onClick={() => {
              setActive("collect");
            }}
          >
            <img src={saved} />
            <span>我的珍藏</span>
          </div>
        )}
      </div>
      {/* <div className="myAssetsPage-menu">
        <div className="myAssets-posts">貼文</div>
        <div className="myAssets-collect">我的收藏</div>
      </div> */}
      {active == "posts" && (
        <div className="myPosts_row">
          {postsData?.length ? (
            postsData.map((item) => {
              return (
                <div className="myPosts_col" key={item.id}>
                  <MyPosts postId={item.id} postsData={item.data} />
                </div>
              );
            })
          ) : (
            <img className="notFound_img" src={NotFound} />
          )}

          {/* <div className="myPosts_col">
            <MyPosts />
          </div>
          <div className="myPosts_col">
            <MyPosts />
          </div> */}
        </div>
      )}
      {user.uid == userData.uid && (
        <>
          {active == "collect" && (
            <div className="myPosts_row">
              {collectedBy?.length ? (
                collectedBy.map((item) => {
                  return (
                    <div className="myPosts_col" key={item.id}>
                      <MyCollect postId={item.id} postsData={item.data} />
                    </div>
                  );
                })
              ) : (
                <img className="notFound_img" src={NotFound} />
              )}

              {/* <div className="myPosts_col">
            <MyCollect />
          </div>
          <div className="myPosts_col">
            <MyCollect />
          </div> */}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MyAssetsPage;
