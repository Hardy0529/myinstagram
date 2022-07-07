import React, { useState } from "react";
import "./BorromBar.css";
import { Search } from "semantic-ui-react";
import algolia from "../../utils/algolia";

//  路由
import { useNavigate, Link } from "react-router-dom";

//firebase
import { app, firebaseDatabase } from "../../utils/firebase";
import { getAuth, signOut } from "firebase/auth";
import { doc, writeBatch } from "firebase/firestore";

// img
import home from "../../images/home.svg";
import search from "../../images/search.svg";
import newpost from "../../images/newpost.svg";
import love from "../../images/love.svg";
import avatar from "../../images/avatar.jpeg";

// 使有者裝態
import { useStateValue } from "../../context/StateProvider";

const BottomBar = (props) => {
  // console.log(props);
  const [{ user }, dispatch] = useStateValue();
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [results, setresults] = useState([]);
  const batch = writeBatch(firebaseDatabase);
  const [interactiveToggle, setInteractiveToggle] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);

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
    <section className="bottom-bar">
      <div className="container">
        <div className="row">
          <div className="col  u-text-center">
            <Link to={"/posts"}>
              <img src={home} width="25px" height="25px" />
            </Link>
          </div>
          <div className="col  u-text-center">
            <span>
              <img
                src={search}
                width="25px"
                height="24px"
                onClick={() => setSearchToggle(!searchToggle)}
              />
              {searchToggle && (
                <div
                  className="interactive-close"
                  // onClick={() => setSearchToggle(!searchToggle)}
                >
                  <div className="interactive-mobile">
                    <div className="interactive-mobile-header">
                      <span onClick={() => setSearchToggle(!searchToggle)}>
                        關閉
                      </span>
                    </div>
                    <div className="bottom-search">
                      <Search
                        className="bottom__searchBar"
                        value={inputValue}
                        onSearchChange={onSearchChange}
                        results={results}
                        noResultsMessage="No results found."
                        onResultSelect={onResultSelect}
                      />
                    </div>
                  </div>
                </div>
              )}
            </span>
          </div>
          <div className="col  u-text-center">
            <img
              src={newpost}
              width="25px"
              height="25px"
              onClick={() => {
                props.setNewPosttoggle(!props.newPosttoggle);
              }}
            />
          </div>
          <div className="col  u-text-center">
            <span
              className="interactive-mobile-container"
              onClick={InteractiveOpen}
            >
              <img
                src={love}
                width="25px"
                height="25px"
                onClick={() => setInteractiveToggle(!interactiveToggle)}
              />
              {props.openDocument && (
                <>
                  {props.openDocument?.length != 0 && (
                    <div className="interactive-mobile_hint">
                      {props.openDocument?.length}
                    </div>
                  )}
                </>
              )}

              {interactiveToggle && (
                <div
                  className="interactive-close"
                  // onClick={() => setInteractiveToggle(!interactiveToggle)}
                >
                  <div className="interactive-mobile">
                    <div className="interactive-mobile-header">
                      <span
                        onClick={() => setInteractiveToggle(!interactiveToggle)}
                      >
                        關閉
                      </span>
                    </div>
                    <div className="interactive-mobile-content">
                      {props.interactive?.length ? (
                        <>
                          {props.interactive.map((item) => {
                            if (item.interactive == "Focus") {
                              return (
                                <div
                                  className={`interactive_mobile_item ${
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
                                  <div className="interactive_content_mobile">
                                    {item.username} 開始追蹤了您
                                  </div>
                                </div>
                              );
                            } else if (item.interactive == "isLiked") {
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
                  </div>
                </div>
              )}
            </span>
          </div>
          <div className="col  u-text-center">
            <div className="user_BottomBarImage">
              <div className="imgbox">
                <div className="imgbox-inner">
                  <div
                    className="image"
                    style={{
                      backgroundImage: `url(${user ? user.photoURL : avatar})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomBar;
