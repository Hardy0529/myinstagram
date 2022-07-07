import React, { useState, useEffect } from "react";
import "../LoginPage/LoginPage.css";

// 路由
import { useParams, useNavigate } from "react-router-dom";

// firebase
import { app, firebaseDatabase, storage } from "../../utils/firebase";
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";

// firebase
import {
  collection,
  setDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

// img
import { SpinningCircles, BallTriangle } from "react-loading-icons";
import inst_image from "../../images/9364675fb26a.svg";
import insta_logo from "../../images/logoinsta.png";

const NewIdentity = () => {
  const batch = writeBatch(firebaseDatabase);
  const [{ user }, dispatch] = useStateValue();
  const auth = getAuth(app);

  const { postId } = useParams();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [fullNameGoogle, setFullNameGoogle] = useState(user.displayName);
  const [fullNameFacebook, setFullNameFacebook] = useState(user.displayName);
  const [username, setUsername] = useState();
  const [render, setRender] = useState(true);
  // 狀態
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const regrex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,18}$/;

  // console.log(user);
  useEffect(() => {
    setRender(true);

    const q = query(
      collection(firebaseDatabase, "users"),
      where("uid", "==", postId)
    );
    onSnapshot(q, (snapshot) => {
      let data = null;
      snapshot.docs.forEach((doc) => {
        data = doc.data();
      });
      // console.log(data);
      if (data != null) {
        navigate(`/loading`);
        // window.location.reload();
      } else {
        setRender(false);
      }
    });
  }, []);

  // console.log(user);
  const UsernameFun = (e) => {
    setUsername(e.target.value);
    const q = query(
      collection(firebaseDatabase, "users"),
      where("username", "==", e.target.value)
    );
    onSnapshot(q, (snapshot) => {
      let data = null;
      snapshot.docs.forEach((doc) => {
        data = doc.data();
      });
      if (data != null) {
        setUsername("此ID已有人使用");
        // setErrorMessage("此ID已有人使用");
      } else {
        setUsername(e.target.value);
        setErrorMessage("");
      }
    });
  };

  const onsubmit = async () => {
    setIsLoading(true);
    if (user.providerId === "google.com") {
      if (file !== null) {
        if (!fullNameGoogle || !username) {
          setErrorMessage("欄位資料不得為空");

          setTimeout(() => {
            setIsLoading(false);
            setErrorMessage("");
          }, 3000);
        } else if (username == "此ID已有人使用") {
          setErrorMessage("此ID已有人使用");
          setIsLoading(false);
        } else if (username.match(regrex) == null) {
          setErrorMessage("用戶名稱須為8-18位，數字與英文字元");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else {
          // 上傳圖片
          const storageRef = ref(
            storage,
            `users-images/${Date.now()}-${file.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const uploadProgress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              setErrorMessage("圖片無法上傳");
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // console.log(downloadURL);

                // 上傳資料至 Cloud Firestore
                const userData = {
                  displayName: fullNameGoogle,
                  username: username,
                  uid: postId,
                  photoURL: downloadURL || user.photoURL,
                  email: user.email,
                  phoneNumber: user.emaiphoneNumberl || "",
                  providerId: user.providerId,
                  createdAt: serverTimestamp(),
                  fansi: [],
                };
                batch.set(
                  doc(firebaseDatabase, "users", `${postId}`),
                  userData,
                  {
                    merge: true,
                  }
                );
                batch.set(
                  doc(
                    firebaseDatabase,
                    `users/${postId}/focus`,
                    `${postId}_focus`
                  ),
                  {
                    focus: [],
                  }
                );
                batch.commit().then(() => {
                  dispatch({
                    type: actionType.SET_USER,
                    user: userData,
                  });
                  localStorage.setItem("user", JSON.stringify(userData));

                  setErrorMessage("");
                  setIsLoading(false);
                  navigate(`/loading`);
                });
              });
            }
          );
        }
      } else {
        if (!fullNameGoogle || !username) {
          setErrorMessage("欄位資料不得為空");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else if (username == "此ID已有人使用") {
          setErrorMessage("此ID已有人使用");
          setIsLoading(false);
        } else if (username.match(regrex) == null) {
          setErrorMessage("用戶名稱須為8-18位，數字與英文字元");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else {
          setErrorMessage("");
          // 上傳資料至 Cloud Firestore
          const userData = {
            displayName: fullNameGoogle,
            username: username,
            uid: postId,
            photoURL: user.photoURL,
            email: user.email,
            phoneNumber: user.emaiphoneNumberl || "",
            providerId: user.providerId,
            createdAt: serverTimestamp(),
            fansi: [],
          };

          batch.set(doc(firebaseDatabase, "users", `${postId}`), userData, {
            merge: true,
          });
          batch.set(
            doc(firebaseDatabase, `users/${postId}/focus`, `${postId}_focus`),
            {
              focus: [],
            }
          );
          batch.commit().then(() => {
            // 上傳資料至 LocalStorage
            dispatch({
              type: actionType.SET_USER,
              user: userData,
            });
            localStorage.setItem("user", JSON.stringify(userData));

            setErrorMessage("");
            setIsLoading(false);
            navigate(`/loading`);
          });
        }
      }
    } else if (user.providerId === "facebook.com") {
      if (file !== null) {
        if (!fullNameFacebook || !username) {
          setErrorMessage("欄位資料不得為空");

          setTimeout(() => {
            setIsLoading(false);
            setErrorMessage("");
          }, 3000);
        } else if (username == "此ID已有人使用") {
          setErrorMessage("此ID已有人使用");
          setIsLoading(false);
        } else if (username.match(regrex) == null) {
          setErrorMessage("用戶名稱須為8-18位，數字與英文字元");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else {
          // 上傳圖片
          const storageRef = ref(
            storage,
            `users-images/${Date.now()}-${file.name}`
          );

          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const uploadProgress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              setErrorMessage("圖片無法上傳");
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // console.log(downloadURL);

                setErrorMessage("");
                // 上傳資料至 Cloud Firestore
                const userData = {
                  displayName: fullNameFacebook,
                  username: username,
                  uid: postId,
                  photoURL:
                    downloadURL ||
                    "https://firebasestorage.googleapis.com/v0/b/myinstagram-8f250.appspot.com/o/avatar.jpeg?alt=media&token=4efe8235-fbb5-46dd-bc99-a392145c77bc",
                  email: user.email,
                  phoneNumber: user.emaiphoneNumberl || "",
                  providerId: user.providerId,
                  createdAt: serverTimestamp(),
                  fansi: [],
                };

                batch.set(
                  doc(firebaseDatabase, "users", `${postId}`),
                  userData,
                  {
                    merge: true,
                  }
                );
                batch.set(
                  doc(
                    firebaseDatabase,
                    `users/${postId}/focus`,
                    `${postId}_focus`
                  ),
                  {
                    focus: [],
                  }
                );
                batch.commit().then(() => {
                  dispatch({
                    type: actionType.SET_USER,
                    user: userData,
                  });
                  localStorage.setItem("user", JSON.stringify(userData));

                  setErrorMessage("");
                  setIsLoading(false);
                  navigate(`/loading`);
                });
              });
            }
          );
        }
      } else {
        if (!fullNameGoogle || !username) {
          setErrorMessage("欄位資料不得為空");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else if (username == "此ID已有人使用") {
          setErrorMessage("此ID已有人使用");
          setIsLoading(false);
        } else if (username.match(regrex) == null) {
          setErrorMessage("用戶名稱須為8-18位，數字與英文字元");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else {
          setErrorMessage("");
          // 上傳資料至 Cloud Firestore
          const userData = {
            displayName: fullNameFacebook,
            username: username,
            uid: postId,
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/myinstagram-8f250.appspot.com/o/avatar.jpeg?alt=media&token=4efe8235-fbb5-46dd-bc99-a392145c77bc",
            email: user.email,
            phoneNumber: user.emaiphoneNumberl || "",
            providerId: user.providerId,
            createdAt: serverTimestamp(),
            fansi: [],
          };

          batch.set(doc(firebaseDatabase, "users", `${postId}`), userData, {
            merge: true,
          });

          batch.set(
            doc(firebaseDatabase, `users/${postId}/focus`, `${postId}_focus`),
            {
              focus: [],
            }
          );

          batch.commit().then(() => {
            // 上傳資料至 LocalStorage
            dispatch({
              type: actionType.SET_USER,
              user: userData,
            });
            localStorage.setItem("user", JSON.stringify(userData));

            setErrorMessage("");
            setIsLoading(false);
            navigate(`/loading`);
          });
        }
      }
    } else {
      if (file !== null) {
        if (!fullName || !username) {
          setErrorMessage("欄位資料不得為空");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else if (username == "此ID已有人使用") {
          setErrorMessage("此ID已有人使用");
          setIsLoading(false);
        } else if (username.match(regrex) == null) {
          setErrorMessage("用戶名稱須為8-18位，數字與英文字元");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else {
          // 上傳圖片
          const storageRef = ref(
            storage,
            `users-images/${Date.now()}-${file.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const uploadProgress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              setErrorMessage("圖片無法上傳");
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // console.log(downloadURL);

                setErrorMessage("");
                // 上傳資料至 Cloud Firestore
                const userData = {
                  displayName: fullName,
                  username: username,
                  uid: postId,
                  photoURL:
                    downloadURL ||
                    "https://firebasestorage.googleapis.com/v0/b/myinstagram-8f250.appspot.com/o/avatar.jpeg?alt=media&token=4efe8235-fbb5-46dd-bc99-a392145c77bc",
                  email: user.email,
                  phoneNumber: user.emaiphoneNumberl || "",
                  providerId: user.providerId,
                  createdAt: serverTimestamp(),
                  fansi: [],
                };

                batch.set(
                  doc(firebaseDatabase, "users", `${postId}`),
                  userData,
                  {
                    merge: true,
                  }
                );
                batch.set(
                  doc(
                    firebaseDatabase,
                    `users/${postId}/focus`,
                    `${postId}_focus`
                  ),
                  {
                    focus: [],
                  }
                );
                batch.commit().then(() => {
                  // 上傳資料至 LocalStorage
                  dispatch({
                    type: actionType.SET_USER,
                    user: userData,
                  });

                  localStorage.setItem("user", JSON.stringify(userData));
                  setIsLoading(false);
                  setErrorMessage("");
                  navigate(`/loading`);
                });
              });
            }
          );
        }
      } else {
        if (!fullName || !username) {
          setErrorMessage("欄位資料不得為空");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else if (username == "此ID已有人使用") {
          setErrorMessage("此ID已有人使用");
          setIsLoading(false);
        } else if (username.match(regrex) == null) {
          setErrorMessage("用戶名稱須為8-18位，數字與英文字元");
          setTimeout(() => {
            setErrorMessage("");
            setIsLoading(false);
          }, 3000);
        } else {
          setErrorMessage("");

          // 上傳資料至 Cloud Firestore
          const userData = {
            displayName: fullName,
            username: username,
            uid: postId,
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/myinstagram-8f250.appspot.com/o/avatar.jpeg?alt=media&token=4efe8235-fbb5-46dd-bc99-a392145c77bc",
            email: user.email,
            phoneNumber: user.emaiphoneNumberl || "",
            providerId: user.providerId,
            createdAt: serverTimestamp(),
            fansi: [],
          };
          batch.set(doc(firebaseDatabase, "users", `${postId}`), userData, {
            merge: true,
          });

          batch.set(
            doc(firebaseDatabase, `users/${postId}/focus`, `${postId}_focus`),
            {
              focus: [],
            }
          );
          batch.commit().then(() => {
            // 上傳資料至 LocalStorage
            dispatch({
              type: actionType.SET_USER,
              user: userData,
            });
            localStorage.setItem("user", JSON.stringify(userData));
            setIsLoading(false);
            setErrorMessage("");
            navigate(`/loading`);
          });
        }
      }
    }
  };

  const previewUrlGoogle = file ? URL.createObjectURL(file) : user.photoURL;
  const previewUrlFacebook = file
    ? URL.createObjectURL(file)
    : "https://firebasestorage.googleapis.com/v0/b/myinstagram-8f250.appspot.com/o/avatar.jpeg?alt=media&token=4efe8235-fbb5-46dd-bc99-a392145c77bc";
  const previewUrl = file
    ? URL.createObjectURL(file)
    : "https://firebasestorage.googleapis.com/v0/b/myinstagram-8f250.appspot.com/o/avatar.jpeg?alt=media&token=4efe8235-fbb5-46dd-bc99-a392145c77bc";
  return (
    <>
      {render ? (
        <div className="loading">
          <BallTriangle />
        </div>
      ) : (
        <>
          {postId == user.uid && (
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
                            <div className="negative message">
                              {errorMessage}
                            </div>
                          )}
                          <div>
                            <div className="imgfile_box">
                              <div className="imgfile_userImgbox">
                                {user.providerId === "password" && (
                                  <img className="" src={`${previewUrl}`} />
                                )}
                                {user.providerId === "facebook.com" && (
                                  <img
                                    className=""
                                    src={`${previewUrlFacebook}`}
                                  />
                                )}
                                {user.providerId === "google.com" && (
                                  <img
                                    className=""
                                    src={`${previewUrlGoogle}`}
                                  />
                                )}
                              </div>

                              <input
                                className="user-file"
                                id="user-img"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                              />

                              <label htmlFor="user-img" className="user-label">
                                上傳圖片
                              </label>
                            </div>

                            {user.providerId === "google.com" && (
                              <input
                                className="logipage__text"
                                type="text"
                                placeholder="Full Name"
                                value={fullNameGoogle}
                                onChange={(e) =>
                                  setFullNameGoogle(e.target.value)
                                }
                              />
                            )}
                            {user.providerId === "facebook.com" && (
                              <input
                                className="logipage__text"
                                type="text"
                                placeholder="Full Name"
                                value={fullNameFacebook}
                                onChange={(e) =>
                                  setFullNameFacebook(e.target.value)
                                }
                              />
                            )}

                            {user.providerId === "password" && (
                              <input
                                className="logipage__text"
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                              />
                            )}

                            <input
                              className="logipage__text"
                              type="text"
                              placeholder="Username"
                              value={username}
                              onChange={UsernameFun}
                            />
                            <button
                              className="login__button"
                              onClick={onsubmit}
                            >
                              {isLoading ? (
                                <SpinningCircles />
                              ) : (
                                "建立新的使用者"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default NewIdentity;
