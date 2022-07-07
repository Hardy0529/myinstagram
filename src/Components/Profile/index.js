import React, { useState, useEffect } from "react";
import "./profile.css";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";

// firebase
import { firebaseDatabase } from "../../utils/firebase";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";

// Components
import Navbar from "../NavBar";
import MemberInformation from "../MemberInformation";
import MyAssetsPage from "../MyAssetsPage";
import CreatePost from "../CreatePost";
import BottomBar from "../BottomBar";

const Profile = () => {
  const [{ user }, dispatch] = useStateValue();
  const [newPosttoggle, setNewPosttoggle] = useState(false);
  const [interactive, setInteractive] = useState(null);
  const [openDocument, setOpenDocument] = useState(null);

  useEffect(() => {
    const colRef = collection(
      firebaseDatabase,
      `users/${user.uid}/interactive`
    );
    const q = query(colRef, where("openDocument", "==", false));
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      // console.log(data);
      setOpenDocument(data);
    });
  }, []);

  useEffect(() => {
    const colRef = collection(
      firebaseDatabase,
      `users/${user.uid}/interactive`
    );
    const q = query(colRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      // console.log(data);
      setInteractive(data);
    });
  }, []);

  return (
    <>
      {newPosttoggle && (
        <CreatePost
          user={user}
          setNewPosttoggle={setNewPosttoggle}
          newPosttoggle={newPosttoggle}
        />
      )}

      <Navbar
        openDocument={openDocument}
        interactive={interactive}
        newPosttoggle={newPosttoggle}
        setNewPosttoggle={setNewPosttoggle}
      />
      <div className="profile">
        <MemberInformation />
        <MyAssetsPage />
      </div>
      <BottomBar
        openDocument={openDocument}
        interactive={interactive}
        newPosttoggle={newPosttoggle}
        setNewPosttoggle={setNewPosttoggle}
      />
    </>
  );
};

export default Profile;
