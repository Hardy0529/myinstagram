import React from "react";
import "./InfoSection.css";

// 路由
import { useNavigate, Link } from "react-router-dom";

// 使用者狀態
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";

// firebase
import { app } from "../../utils/firebase";
import { getAuth, signOut } from "firebase/auth";

// img
import Avatar from "../../images/avatar.jpeg";

const InfoSection = () => {
  const [{ user }, dispatch] = useStateValue();

  const auth = getAuth(app);
  const navigate = useNavigate();

  const logout = () => {
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

  return (
    <div>
      <div className="info_container">
        <Link to={"/posts/" + user.username}>
          <div className="info_imageBox">
            <div className="imgbox">
              <div className="imgbox-inner">
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(${user ? user.photoURL : Avatar})`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Link>

        <div className="info_content">
          <Link to={"/posts/" + user.username}>
            <div className="info_username">
              {user ? user.username : "使用者"}
            </div>
          </Link>
          <div className="info_logut" onClick={logout}>
            切換帳戶
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
