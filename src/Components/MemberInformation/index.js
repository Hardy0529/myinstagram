import React, { useEffect, useState } from "react";
import "./MemberInformation.css";

// 路由
import { useLocation } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";

// firebase
import { firebaseDatabase } from "../../utils/firebase";
import {
  doc,
  arrayRemove,
  arrayUnion,
  collection,
  query,
  where,
  onSnapshot,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

// img
import Avatar from "../../images/avatar.jpeg";

const MemberInformation = () => {
  const [{ user }, dispatch] = useStateValue();
  const batch = writeBatch(firebaseDatabase);
  const [postsData, setPostsData] = useState([]);
  const [focusData, setFocusData] = useState([]);

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const colRef = collection(firebaseDatabase, "users");
    const q = query(
      colRef,
      where("username", "==", location.pathname.replace("/posts/", ""))
    );
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      });
      setPostsData(data[0]);
      // console.log(data[0]);
    });
  }, [location]);

  useEffect(() => {
    const colRef = collection(firebaseDatabase, `users/${postsData.uid}/focus`);
    const q = query(colRef);
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      });
      setFocusData(data[0]?.focus);
      // console.log(data[0]?.focus);
    });
  }, [postsData]);

  const focusToggle = async () => {
    let washingtonRefFansi = doc(firebaseDatabase, "users", postsData.uid);
    let washingtonRefFocus = doc(
      firebaseDatabase,
      `users/${user.uid}/focus`,
      `${user.uid}_focus`
    );

    if (isFansi) {
      batch.update(washingtonRefFansi, { fansi: arrayRemove(user.uid) });

      batch.update(washingtonRefFocus, {
        focus: arrayRemove(postsData.uid),
      });
    } else {
      batch.update(washingtonRefFansi, { fansi: arrayUnion(user.uid) });

      batch.update(washingtonRefFocus, {
        focus: arrayUnion(postsData.uid),
      });

      // interactive
      const nycRef = doc(
        firebaseDatabase,
        `users/${postsData.uid}/interactive/`,
        `${postsData.uid}_${Date.now()}_${user.uid}`
      );
      batch.set(nycRef, {
        uid: user.uid,
        username: user.username,
        photoURL: user.photoURL,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
        openDocument: false,
        interactive: "Focus",
      });
    }

    batch.commit().then(() => {
      // window.location.reload();
    });
    // if (isFansi) {
    //   updateDoc(washingtonRefFansi, {
    //     // collectedBy: [user.uid],
    //     fansi: arrayRemove(user.uid),
    //   });
    //   updateDoc(washingtonRefFocus, {
    //     // collectedBy: [user.uid],
    //     focus: arrayRemove(postsData.uid),
    //   });
    // } else {
    //   updateDoc(washingtonRefFansi, {
    //     // collectedBy: [user.uid],
    //     fansi: arrayUnion(user.uid),
    //   });
    //   // const washingtonRefFocus = doc(firebaseDatabase, "users", user.uid);
    //   updateDoc(washingtonRefFocus, {
    //     // collectedBy: [user.uid],
    //     focus: arrayUnion(postsData.uid),
    //   });
    // }
  };

  if (postsData) {
    var isFansi = postsData.fansi?.includes(user.uid);
  }

  // console.log(isFansi);
  // console.log(isFocus);
  return (
    <>
      {postsData && (
        <>
          <div className="memberInfo">
            <div className="memberInfo-imgbox">
              <div className="imgbox">
                <div className="imgbox-inner">
                  <div
                    className="image"
                    style={{
                      backgroundImage: `url(${
                        postsData ? postsData.photoURL : Avatar
                      })`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="memberInfo-info">
              <div className="memberInfo-user">
                <div className="memberInfo-username">
                  {postsData && postsData.username}
                </div>
                <div className="memberInfo-setting">
                  {user.uid == postsData.uid ? (
                    <>
                      {/* <span className="memberInfo_setting_button" href="#">
                      編輯個人檔案
                    </span> */}
                    </>
                  ) : (
                    <span
                      className="memberInfo_setting_button"
                      href="#"
                      onClick={() => focusToggle()}
                    >
                      {isFansi ? "已追蹤" : "追蹤"}
                    </span>
                  )}
                </div>
              </div>

              <div className="memberInfo-interactive">
                <div className="memberInfo-posts_quantity">
                  <span>{postsData.posts?.length || 0}</span>貼文
                </div>
                <div className="memberInfo-fan_quantity">
                  <span>{postsData.fansi?.length || 0}</span>位粉絲
                </div>
                <div className="memberInfo-follow_quantity">
                  <span>{focusData?.length || 0}</span>追蹤中
                </div>
              </div>
            </div>
          </div>
          <div className="memberInfo-interactive-mobile">
            <div className="memberInfo-posts_quantity-mobile">
              <span>{postsData.posts?.length || 0}</span>貼文
            </div>
            <div className="memberInfo-fan_quantity-mobile">
              <span>{postsData.fansi?.length || 0}</span>位粉絲
            </div>
            <div className="memberInfo-follow_quantity-mobile">
              <span>{focusData?.length || 0}</span>追蹤中
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MemberInformation;
