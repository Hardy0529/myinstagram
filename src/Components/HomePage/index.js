import React, { useEffect, useState } from "react";

//使用者狀態
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
import MainContent from "../MainContent";
import BottomBar from "../BottomBar";
import CreatePost from "../CreatePost";

const HomePage = () => {
  const [{ user }, dispatch] = useStateValue();
  const [newPosttoggle, setNewPosttoggle] = useState(false);
  const [interactive, setInteractive] = useState(null);
  const [openDocument, setOpenDocument] = useState(null);
  // const auth = getAuth(app);

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
      <MainContent />
      <BottomBar
        openDocument={openDocument}
        interactive={interactive}
        newPosttoggle={newPosttoggle}
        setNewPosttoggle={setNewPosttoggle}
      />
    </>
  );
};

export default HomePage;
