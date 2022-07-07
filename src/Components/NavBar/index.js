import React, { useState } from "react";
import { Search } from "semantic-ui-react";
import algolia from "../../utils/algolia";
import "./NavBar.css";

//  路由
import { useNavigate, Link } from "react-router-dom";

//使用者狀態
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";

//firebase
import { app, firebaseDatabase } from "../../utils/firebase";
import { getAuth, signOut } from "firebase/auth";
import { doc, writeBatch } from "firebase/firestore";

// img
import logo from "../../images/logo.png";
import home from "../../images/home.svg";
import message from "../../images/message.svg";
import find from "../../images/find.svg";
import profile from "../../images/profile.svg";
import saved from "../../images/saved.svg";
import settings from "../../images/settings.svg";
import love from "../../images/love.svg";
import newpost from "../../images/newpost.svg";
import Avatar from "../../images/avatar.jpeg";

const Navbar = (props) => {
  const [{ user }, dispatch] = useStateValue();
  const auth = getAuth(app);
  const batch = writeBatch(firebaseDatabase);
  const navigate = useNavigate();
  const [interactiveToggle, setInteractiveToggle] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [results, setresults] = useState([]);

  const logout = () => {
    setIsMenu(false);
    localStorage.clear();
    dispatch({
      type: actionType.SET_USER,
      user: null,
    });

    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const InteractiveOpen = () => {
    setTimeout(() => {
      props.openDocument?.forEach((element) => {
        console.log(element);

        let interactiveRef = doc(
          firebaseDatabase,
          `users/${user.uid}/interactive/`,
          `${element.id}`
        );
        batch.update(interactiveRef, { openDocument: true });
      });

      batch.commit().then(() => {
        // window.location.reload();
      });
    }, 2000);
  };

  const onSearchChange = (e, { value }) => {
    setInputValue(value);
    algolia.search(value).then((result) => {
      const searchResults = result.hits.map((hit) => {
        return {
          // title: hit.title,
          // description: hit.content,
          title: hit.username,
          id: hit.objectID,
        };
      });
      // console.log(searchResults);
      setresults(searchResults);
    });
  };

  const onResultSelect = (e, { result }) => {
    navigate(`/posts/${result.title}`);
  };
  return (
    <div className="navbar__barContent">
      <div className="container">
        <div className="navbar">
          <Link to={"/posts"}>
            <img className="navbar_logo" src={logo} />
          </Link>
          <Search
            className="navbar__searchBar"
            value={inputValue}
            onSearchChange={onSearchChange}
            results={results}
            noResultsMessage="No results found."
            onResultSelect={onResultSelect}
          />
          {/* <input
            // text="text"
            type="text"
         
            placeholder="Search"
          /> */}
          <div className="navbarImg__box">
            <Link to={"/posts"}>
              <img
                className="navbar__img u-sm-none"
                src={home}
                width="25px"
                height="25px"
              />
            </Link>
            {/* <img
              className="navbar__img"
              src={message}
              width="25px"
              height="25px"
            /> */}
            <img
              className="navbar__img u-sm-none"
              src={newpost}
              width="25px"
              height="25px"
              onClick={() => {
                props.setNewPosttoggle(!props.newPosttoggle);
              }}
            />
            {/* <img
                className="navbar__img"
                src={find}
                width="25px"
                height="25px"
              /> */}
            <span onClick={() => setInteractiveToggle(!interactiveToggle)}>
              <img
                className="navbar__img u-sm-none"
                src={love}
                width="25px"
                height="25px"
                onClick={InteractiveOpen}
              />
              {props.openDocument && (
                <>
                  {props.openDocument?.length != 0 && (
                    <div className="interactive_hint">
                      {props.openDocument?.length}
                    </div>
                  )}
                </>
              )}

              {interactiveToggle && (
                <>
                  <div
                    className="interactiveClosure"
                    onClick={() => setInteractiveToggle(!interactiveToggle)}
                  ></div>

                  <div className="interactive">
                    {props.interactive?.length ? (
                      <>
                        {props.interactive.map((item) => {
                          if (item.interactive == "Focus") {
                            return (
                              <div
                                className={`interactive_item ${
                                  item.openDocument ? "openDocument" : ""
                                }`}
                                key={item.id}
                              >
                                <div className="interactiveImgbox">
                                  <div className="imgbox">
                                    <div className="imgbox-inner">
                                      <div
                                        className="image"
                                        style={{
                                          backgroundImage: `url(${item.photoURL})`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="interactive_content">
                                  {item.username} 開始追蹤了您
                                </div>
                              </div>
                            );
                          } else if (item.interactive == "isLiked") {
                            return (
                              <div
                                className={`interactive_item ${
                                  item.openDocument ? "openDocument" : ""
                                }`}
                                key={item.id}
                              >
                                <div className="interactiveImgbox">
                                  <div className="interactiveImgbox-inner">
                                    <div
                                      className="interactive__Image"
                                      style={{
                                        backgroundImage: `url(${item.photoURL})`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="interactive_content">
                                  {item.username} 對您的文章按讚
                                </div>
                              </div>
                            );
                          } else if (item.interactive == "Comment") {
                            return (
                              <div
                                className={`interactive_mobile_item  ${
                                  item.openDocument ? "openDocument" : ""
                                }`}
                                key={item.id}
                              >
                                <div className="interactiveImgbox_mobile">
                                  <div className="imgbox">
                                    <div className="imgbox-inner">
                                      <div
                                        className="image"
                                        style={{
                                          backgroundImage: `url(${item.photoURL})`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="interactive_mobile_content">
                                  {item.username} 對您的文章留言 : 「
                                  {item.content}」
                                </div>
                              </div>
                            );
                          }
                        })}
                      </>
                    ) : (
                      <div className="interactiveNotStarted">
                        搜尋不到好友與您的互動紀錄
                      </div>
                    )}
                  </div>

                  {/* {props.interactive?.length ? (
                    props.interactive.map((item) => {
                      return (
                      
                          
                      
                      );
                    })
                  ) : (
                    <>123</>
                  )} */}
                </>
              )}
            </span>

            <span onClick={() => setIsMenu(!isMenu)}>
              <span className="navbarUserImgbox">
                <div
                  className="navbarUserImgbox_img"
                  style={{
                    backgroundImage: `url(${user ? user.photoURL : Avatar})`,
                  }}
                ></div>
              </span>
              {/* <img
                className="navbar__img"
                src={user ? user.photoURL : Avatar}
                width="25px"
                height="25px"
                style={{ borderRadius: `50%` }}
                onClick={() => setIsMenu(!isMenu)}
              /> */}
              {user && (
                <>
                  {isMenu && (
                    <>
                      <div
                        className="isMenuClosure"
                        onClick={() => setIsMenu(!isMenu)}
                      ></div>
                      <ul className="dropdown">
                        <li>
                          <img src={profile} width="16px" height="16px" />
                          <Link
                            to={"/posts/" + user.username}
                            onClick={() => setIsMenu(!isMenu)}
                          >
                            個人主頁
                          </Link>
                        </li>
                        <li>
                          <img src={saved} width="16px" height="16px" />
                          <Link
                            to={"/posts/" + user.username + "?saved=collect"}
                            onClick={() => setIsMenu(!isMenu)}
                          >
                            收藏內容
                          </Link>
                        </li>
                        {/* <li>
                          <img src={settings} width="16px" height="16px" />
                          <a href="#">Settings</a>
                        </li> */}
                        <li className="logOut" onClick={logout}>
                          <span>切換帳戶</span>
                        </li>
                      </ul>
                    </>
                  )}
                </>
              )}
            </span>

            {/* <Avatar
                src={pp}
                className="navbar__img"
                style={{ maxWidth: "25px", maxHeight: "25px" }}
              /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
