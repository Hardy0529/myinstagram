import React from "react";
import "./ResetPassword.css";

// 路由
import { Link } from "react-router-dom";

// img
import logo from "../../images/logo.png";

const index = () => {
  return (
    <>
      <div className="navbar__barContent">
        <div className="container">
          <div className="navbar">
            <Link to={"/posts"}>
              <img className="navbar_logo" src={logo} />
            </Link>
          </div>
        </div>
      </div>

      <div className="resetPassword">
        <div className="container">
          <div className="resetPassword_row">
            <div className="resetPassword__main">
              <div className="resetPassword__Imgbox">
                <span className="coreSpriteLockSmall"></span>
              </div>
              <span className="resetPassword__title">無法登入?</span>
              <span className="resetPassword__content">
                請輸入您的電子郵件，方便我們給您發送帳號。
              </span>

              <input
                className="resetPassword__text"
                type="text"
                placeholder="Email"
              />
              <button className="resetPassword__button">發送登入帳號</button>
              <div className="resetPassword__ordiv">
                <div className="resetPassword___dividor"></div>
                <div className="login__or">或</div>
                <div className="resetPassword___dividor"></div>
              </div>
              <div>
                <Link to={"/register"} className="resetPassword_NewAccoun">
                  建立新帳戶
                </Link>
              </div>
            </div>
            <div className="resetPassword_BackToLogin">
              <Link to={"/login"} className="resetPassword_BackToLogin_button">
                返回登入頁面
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
