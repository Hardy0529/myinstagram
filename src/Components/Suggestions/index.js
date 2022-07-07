import React, { useEffect, useState } from "react";
import "./Suggestions.css";

// 路由
import { Link } from "react-router-dom";

// 使用者狀態
import { useStateValue } from "../../context/StateProvider";

// firebase
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { firebaseDatabase } from "../../utils/firebase";

// import imageSrc1 from "../../images/pp1.png";
// import imageSrc2 from "../../images/pp2.png";
// import imageSrc3 from "../../images/pp3.jpeg";

const Suggestions = () => {
  const [{ user }] = useStateValue();
  const [friends, setFriends] = useState("");
  useEffect(() => {
    const colRef = collection(firebaseDatabase, "users");
    const q = query(colRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      });
      setFriends(data);
      // console.log(data);
    });
  }, []);
  return (
    <div>
      <div className="suggestions__container">
        <div className="suggestions__header">
          <div>為您推薦</div>
        </div>
        <div className="suggestions__body">
          {friends &&
            friends.map((friend) => {
              if (friend.uid != user.uid) {
                return (
                  <div className="suggestions__friends" key={friend.username}>
                    <Link
                      className="suggestions__imageBox"
                      to={"/posts/" + friend.username}
                    >
                      <div className="imgbox">
                        <div className="imgbox-inner">
                          <div
                            className="image"
                            style={{
                              backgroundImage: `url(${friend.photoURL})`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </Link>
                    <div className="suggestions__info">
                      <Link
                        to={"/posts/" + friend.username}
                        className="suggestions__username"
                      >
                        {friend.username}
                      </Link>
                      <Link to={"/posts/" + friend.username}>
                        <div className="suggestions__follow">追蹤</div>
                      </Link>
                    </div>
                  </div>
                );
              }
            })}

          {/* <div className="suggestions__friends">
            <img className="suggestions__image" src={imageSrc2} />
            <div className="suggestions__info">
              <div className="suggestions__username">dummy_user</div>
              <div className="suggestions__follow">Follow</div>
            </div>
          </div>
          <div className="suggestions__friends">
            <img className="suggestions__image" src={imageSrc3} />
            <div className="suggestions__info">
              <div className="suggestions__username">technical_interview</div>
              <div className="suggestions__follow">Follow</div>
            </div>
          </div>
          <div className="suggestions__friends">
            <img className="suggestions__image" src={imageSrc2} />
            <div className="suggestions__info">
              <div className="suggestions__username">subscribe_me</div>
              <div className="suggestions__follow">Follow</div>
            </div>
          </div>
          <div className="suggestions__friends">
            <img className="suggestions__image" src={imageSrc3} />
            <div className="suggestions__info">
              <div className="suggestions__username">like_and _share</div>
              <div className="suggestions__follow">Follow</div>
            </div>
          </div>
          <div className="suggestions__friends">
            <img className="suggestions__image" src={imageSrc1} />
            <div className="suggestions__info">
              <div className="suggestions__username">hit_bell_icon</div>
              <div className="suggestions__follow">Follow</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
