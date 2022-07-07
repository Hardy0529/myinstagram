import React from "react";

// StyleSheet
import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";

import { Route, Routes, useNavigate } from "react-router-dom";

// Components
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";

import HomePage from "./Components/HomePage";
import NewIdentity from "./Components/NewIdentity";
import ResetPassword from "./Components/ResetPassword";
import Profile from "./Components/Profile";
import Loading from "./Components/Loading";

import { useStateValue } from "./context/StateProvider";

function App() {
  const navigate = useNavigate();
  const [{ user }, dispatch] = useStateValue();
  // console.log(user.username);

  return (
    <div className="App">
      <Routes>
        {/* 登入頁面 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 註冊頁面 */}
        <Route path="/register" element={<RegisterPage />} />
        {/* 忘記密碼 */}
        <Route
          path="/accounts/password/reset/"
          element={<ResetPassword />}
        ></Route>

        {/* 建立使用者 */}
        <Route
          path="/createNewIdentity/:postId"
          element={user ? <NewIdentity /> : <LoginPage />}
        />

        {/* 文章首頁 */}
        <Route
          path="/loading"
          element={
            user ? (
              <>{user.username ? <Loading /> : <LoginPage />}</>
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/*"
          element={
            user ? (
              <>{user.username ? <HomePage /> : <LoginPage />}</>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/posts"
          element={
            user ? (
              <>
                {user.username ? (
                  <HomePage />
                ) : (
                  <>
                    <LoginPage />
                  </>
                )}
              </>
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Profile */}
        <Route
          path="/posts/:postId/"
          element={
            user ? (
              <>{user.username ? <Profile /> : <LoginPage />}</>
            ) : (
              <LoginPage />
            )
          }
        />
        {/* Saved */}

        <Route
          path="/posts/:postId/"
          element={
            user ? (
              <>{user.username ? <Profile /> : <LoginPage />}</>
            ) : (
              <LoginPage />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
