import React, { useState } from "react";
import "./Newpost.css";

// 使用者裝態
import { useStateValue } from "../../context/StateProvider";

// firebase
import { firebaseDatabase, storage } from "../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, collection, setDoc, serverTimestamp } from "firebase/firestore";

// img
import { BallTriangle } from "react-loading-icons";
import close from "../../images/close.svg";
import createPost from "../../images/createPost.svg";

const CreatePost = (props) => {
  const [{ user }, dispatch] = useStateValue();

  const [post, setPoat] = useState("");
  const [file, setFile] = useState(null);
  const [create, setCreate] = useState(false);
  const [createPostNext, setCreatePostNext] = useState(false);

  const newpost = () => {
    setCreate(true);
    if (!post || !file) {
      alert("必填字段不能为空");
      setCreate(false);
    } else {
      const storageRef = ref(storage, `post-images/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      let date = new Date().toDateString();
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          // console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const newPostRef = doc(collection(firebaseDatabase, "posts"));

            setDoc(newPostRef, {
              content: post,
              imageUrl: downloadURL,
              createdAt: serverTimestamp(),
              // date: date,
              // id: `${user.uid}_${Date.now()}`,
              author: {
                displayName: user.displayName || "",
                username: user.username || "",
                photoURL: user.photoURL || "",
                uid: user.uid,
                email: user.email,
              },
            }).then(() => {
              setCreate(false);
              setFile(null);
              setPoat("");

              props.setNewPosttoggle(!props.newPosttoggle);
            });
          });
        }
      );
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : "";
  return (
    <>
      {create && (
        <div className="newpost_Loding">
          <BallTriangle />
        </div>
      )}
      <div className="newpost">
        <div
          className="newpost_close"
          onClick={() => props.setNewPosttoggle(!props.newPosttoggle)}
        >
          <div
            className="newpost_close_icon"
            onClick={() => props.setNewPosttoggle(!props.newPosttoggle)}
          >
            <img src={close} width="25px" height="25px" />
          </div>
        </div>
        <div className="newpost_container">
          {createPostNext ? (
            <>
              {file ? (
                <div className="newpost_header">
                  編輯貼文
                  <span
                    className="newpost_header-Previous"
                    onClick={() => {
                      setCreatePostNext(!createPostNext);
                    }}
                  >
                    上一步
                  </span>
                  <span className="newpost_header-share" onClick={newpost}>
                    分享
                  </span>
                </div>
              ) : (
                <div className="newpost_header">建立新貼文</div>
              )}
            </>
          ) : (
            <>
              {file ? (
                <div className="newpost_header">
                  建立新貼文
                  <span
                    className="newpost_header-Next"
                    onClick={() => {
                      setCreatePostNext(!createPostNext);
                    }}
                  >
                    下一步
                  </span>
                </div>
              ) : (
                <div className="newpost_header">建立新貼文</div>
              )}
            </>
          )}

          <div className="newpost_content">
            {createPostNext ? (
              <div className="newpost_createPost">
                <div className="newpost_createPost-Imgbox">
                  <img
                    className="newpost_createPost-Image"
                    src={`${previewUrl}`}
                  />
                </div>

                <div className="newpost_post">
                  <div className="newpost_post_user">
                    <div className="newpost_post_userImgbox">
                      <div className="imgbox">
                        <div className="imgbox-inner">
                          <div
                            className="image"
                            style={{
                              backgroundImage: `url(${user.photoURL})`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="newpost_post_userName">{user.username}</div>
                  </div>

                  <textarea
                    className="newpost_content_update"
                    value={post}
                    onChange={(e) => {
                      setPoat(e.target.value);
                    }}
                    placeholder="輸入文章內容"
                    rows="10"
                  ></textarea>

                  {/* <button type="button" onClick={newpost}>
                  送出
                </button> */}
                </div>
              </div>
            ) : (
              <>
                <div className="newpost_Imgbox">
                  <div
                    className="image"
                    style={{
                      backgroundImage: ` url("${previewUrl}")`,
                    }}
                  ></div>
                </div>
                <input
                  className="newpost_file"
                  type="file"
                  id="newpost-img"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <></>
                ) : (
                  <span className="newpost_photo">
                    <img src={createPost} width="100px" height="100px" />
                    <div className="newpost_photo-content">
                      將相片拖移到這裡
                    </div>
                    <label
                      htmlFor="newpost-img"
                      className="newpost_photo-label"
                    >
                      選擇檔案
                    </label>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
