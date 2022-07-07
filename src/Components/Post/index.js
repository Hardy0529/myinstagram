import React, { useState, useEffect } from "react";
import "./Post.css";
import "./comment.css";

// 路由
import { Link } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";

// firebase
import { firebaseDatabase } from "../../utils/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch,
  serverTimestamp,
  collection,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";

// Component
import Comment from "../Comment";

// img
import { SpinningCircles } from "react-loading-icons";
import love from "../../images/love.svg";
import love2 from "../../images/love2.svg";
import comment from "../../images/comment.svg";
import bookmark from "../../images/bookmark.svg";
import bookmark2 from "../../images/bookmark2.svg";
import close from "../../images/close.svg";

const Post = (props) => {
  const [{ user }] = useStateValue();
  const batch = writeBatch(firebaseDatabase);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentBox, setCommentBox] = useState(false);

  useEffect(() => {
    const colRef = collection(
      firebaseDatabase,
      `posts/${props.postId}/comment`
    );
    const q = query(colRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      // console.log(data);
      setComments(data);
    });
  }, []);

  const toggleCollected = () => {
    const washingtonRef = doc(firebaseDatabase, "posts", props.postId);
    if (isCollected) {
      //   if (isCollected) {
      updateDoc(washingtonRef, {
        // collectedBy: [user.uid],
        collectedBy: arrayRemove(user.uid),
      });
    } else {
      updateDoc(washingtonRef, {
        //     // collectedBy: [user.uid],
        collectedBy: arrayUnion(user.uid),
      });
    }
  };

  const toggleLiked = () => {
    const washingtonRef = doc(firebaseDatabase, "posts", props.postId);

    if (isLiked) {
      batch.update(washingtonRef, { likedBy: arrayRemove(user.uid) });
      // updateDoc(washingtonRef, {
      //   // likedBy: [user.uid],
      //   likedBy: arrayRemove(user.uid),
      // });
    } else {
      batch.update(washingtonRef, { likedBy: arrayUnion(user.uid) });
      //   updateDoc(washingtonRef, {
      //     // likedBy: [user.uid],
      //     likedBy: arrayUnion(user.uid),
      //   });

      // interactive
      // console.log(props.postsData.author.uid);

      const nycRef = doc(
        firebaseDatabase,
        `users/${props.postsData.author.uid}/interactive/`,
        `${props.postsData.author.uid}_${Date.now()}_${user.uid}`
      );
      batch.set(nycRef, {
        uid: user.uid,
        username: user.username,
        photoURL: user.photoURL,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
        openDocument: false,
        interactive: "isLiked",
      });
    }
    batch.commit().then(() => {});
  };

  let isCollected = props.postsData.collectedBy?.includes(user.uid);
  let isLiked = props.postsData.likedBy?.includes(user.uid);

  const onSubmit = () => {
    setIsLoading(true);
    const sfRef = doc(firebaseDatabase, "posts", props.postId);
    batch.update(sfRef, { commentContent: increment(1) });

    const nycRef = doc(
      firebaseDatabase,
      `posts/${props.postId}/comment/`,
      `${props.postId}_${Date.now()}_${user.uid}`
    );
    batch.set(nycRef, {
      content: commentContent,
      createdAt: serverTimestamp(),
      author: {
        displayName: user.displayName || "",
        username: user.username || "",
        photoURL: user.photoURL || "",
        uid: user.uid,
        email: user.email,
      },
    });

    // interactive
    const nycRefComment = doc(
      firebaseDatabase,
      `users/${props.postsData.author.uid}/interactive/`,
      `${props.postsData.author.uid}_${Date.now()}_${user.uid}`
    );
    batch.set(nycRefComment, {
      uid: user.uid,
      username: user.username,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: serverTimestamp(),
      openDocument: false,
      interactive: "Comment",
      content: commentContent,
    });

    batch.commit().then(() => {
      setIsLoading(false);
      setCommentContent("");
    });
  };

  return (
    <>
      {commentBox && (
        <div className="commentBox">
          <div
            className="comment_close"
            onClick={() => {
              setCommentBox(!commentBox);
            }}
          >
            <div
              className="comment_close_icon"
              onClick={() => {
                setCommentBox(!commentBox);
              }}
            >
              <img src={close} width="25px" height="25px" />
            </div>
          </div>
          <div className="comment_container">
            <div className="comment_content">
              <div className="comment_Imagebox">
                <img
                  className="comment_Image"
                  src={`${props.postsData.imageUrl}`}
                />
              </div>
              <div className="comment_content_postBox">
                <div className="comment_content_post">
                  <div className="comment_content_post_user">
                    <div className="comment_content_post_userImgbox">
                      <div className="imgbox">
                        <div className="imgbox-inner">
                          <div
                            className="image"
                            style={{
                              backgroundImage: ` url("${props.postsData.author.photoURL}")`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="comment_content_post_userName">
                      {props.postsData.author.username}
                    </div>
                  </div>
                  <div className="comment_user">
                    <div className="comment__item">
                      <div className="comment__user">
                        <Link
                          className="comment__imageBox"
                          to={"/posts/" + props.postsData.author.username}
                        >
                          <div className="imgbox">
                            <div className="imgbox-inner">
                              <div
                                className="image"
                                style={{
                                  backgroundImage: `url(${props.postsData.author.photoURL})`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </Link>
                        <Link
                          to={"/posts/" + props.postsData.author.username}
                          className="comment__username"
                        >
                          {props.postsData.author.username}
                        </Link>
                      </div>
                      <div className="comment__info">
                        <div>{props.postsData.content}</div>
                      </div>
                    </div>

                    {comments &&
                      comments.map((comment) => {
                        return <Comment comment={comment} key={comment.id} />;
                      })}
                  </div>
                </div>

                <div>
                  <div className="comment_post_reactimages">
                    <span>
                      {isLiked ? (
                        <img
                          src={love2}
                          className="post_reactimage"
                          onClick={toggleLiked}
                        />
                      ) : (
                        <img
                          src={love}
                          className="post_reactimage"
                          onClick={toggleLiked}
                        />
                      )}

                      <img
                        src={comment}
                        className="post_reactimage"
                        // onClick={() => {
                        //   setCommentBox(!commentBox);
                        // }}
                      />
                    </span>
                    {isCollected ? (
                      <img
                        src={bookmark2}
                        className="post_reactimage"
                        onClick={toggleCollected}
                      />
                    ) : (
                      <img
                        src={bookmark}
                        className="post_reactimage"
                        onClick={toggleCollected}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      marginLeft: "18px",
                      marginBottom: "8px  ",
                    }}
                  >
                    {props.postsData.likedBy?.length || 0} 讚
                  </div>
                  <div className="post_comment_date">
                    {props.postsData.createdAt?.toDate().toLocaleDateString()}
                  </div>
                  <div className="post__commentform">
                    <input
                      text="text"
                      className="post__commentbox"
                      placeholder="添加評論..."
                      value={commentContent}
                      onChange={(e) => {
                        setCommentContent(e.target.value);
                      }}
                    />
                    <button onClick={onSubmit}>
                      {isLoading ? <SpinningCircles /> : "發布"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="post__container" id={props.postId}>
        {/* Header */}
        <div className="post__header">
          <Link to={"/posts/" + props.postsData.author.username}>
            <div className="post__userImgbox">
              <div className="post__userImgbox_inner ">
                <div
                  className=" post__userImage"
                  style={{
                    backgroundImage: `url(${props.postsData.author.photoURL})`,
                  }}
                ></div>
              </div>
            </div>
          </Link>
          <Link to={"/posts/" + props.postsData.author.username}>
            <div className="post__username">
              {props.postsData.author.username}
            </div>
          </Link>
        </div>
        {/* Image */}
        <div className="imgbox">
          <div className="imgbox_inner">
            <div
              className="images"
              style={{
                backgroundImage: ` url("${props.postsData.imageUrl}")`,
              }}
            ></div>
          </div>
        </div>
        {/* Analytics */}
        <div>
          <div
            className="post_reactimages"
            style={{ marginLeft: "10px", marginRight: "10px  " }}
          >
            <span>
              {isLiked ? (
                <img
                  src={love2}
                  className="post_reactimage"
                  onClick={toggleLiked}
                />
              ) : (
                <img
                  src={love}
                  className="post_reactimage"
                  onClick={toggleLiked}
                />
              )}

              <img
                src={comment}
                className="post_reactimage"
                onClick={() => {
                  setCommentBox(!commentBox);
                }}
              />
            </span>

            {isCollected ? (
              <img
                src={bookmark2}
                className="post_reactimage"
                onClick={toggleCollected}
              />
            ) : (
              <img
                src={bookmark}
                className="post_reactimage"
                onClick={toggleCollected}
              />
            )}
          </div>
          <div style={{ fontWeight: "bold", marginLeft: "18px  " }}>
            {props.postsData.likedBy?.length || 0} 讚
          </div>
        </div>
        {/* Comment Section */}
        <div>
          <div className="post_comment">
            {props.postsData.author.username} : {props.postsData.content}
          </div>
          <div
            className="post_comment_all"
            onClick={() => {
              setCommentBox(!commentBox);
            }}
          >
            全部 {props.postsData.commentContent || 0} 條評論
          </div>
          <div className="post_comment_date">
            {props.postsData.createdAt?.toDate().toLocaleDateString()}
          </div>
          <div className="post__commentform">
            <input
              text="text"
              className="post__commentbox"
              placeholder="添加評論..."
              value={commentContent}
              onChange={(e) => {
                setCommentContent(e.target.value);
              }}
            />
            <button onClick={onSubmit}>
              {" "}
              {isLoading ? <SpinningCircles /> : "發布"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
