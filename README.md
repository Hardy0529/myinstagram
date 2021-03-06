# React 加上 Firebase 打造社群網站

<p align="center">
  <img src="https://i.imgur.com/2etPtMp.gif" />
  <br/>
  Demo: https://myinstagram-8f250.web.app/
</p>

## 簡介

React 加上 Firebase 打造社群網站<br/>

讓用戶與喜愛的人事物拉近距離<br/>
分享近況或查看來自全球各地其他用戶最新消息。
探索我們的社群，並在此盡情展現自我，分享日常的點點滴滴，或生命精彩的時刻。

## 測試帳號

您可以註冊一個新會員或使用第三方登入進到社群網站來分享您的近況。

| 帳號 | test@gmail.com |
| ---- | -------------- |
| 密碼 | Test12345678   |

## 技術開發


1、社群網站主要使用 React 加上 Firebase 架設而成。<br/>
2、串接 Firebase Firestore 實現發表文章、留言、按讚、收藏、會員資料、追蹤<br/>
3、利用拖移將圖片上傳至 Firebase Storage 雲端。<br/>
4、引入react-router-dom<br/>
5、串接 Firebase Authentication  建立會員系統、第三方登入、忘記密碼<br/>
6、Firebase Extensions  監聽集合 利用 Algolia 實現搜尋服務串接<br/>
7、手刻頁面版型，自行撰寫 RWD 響應式網頁<br/>

### firebse

| Firestore | 發表文章、留言、按讚、收藏、會員資料、追蹤 | <br/>
| Storage | 文章圖片、會員頭像 |<br/>
| Authentication | 會員登入、會員註冊、google 登入、facebook 登入、忘記密碼、 |<br/>
| Hosting | 網站部署 ｜<br/>
| Extensions | 文章搜尋(Algolia)|<br/>

## 特征

### 文章發表與圖片上傳
<img src="https://i.imgur.com/qZJUsS4.gif" />
  
### 追蹤喜愛的用戶
<img src="https://i.imgur.com/xhdMVgB.gif" />


### 收藏與按讚
<img src="https://i.imgur.com/dZXwNXX.gif" />

### 留言互動即時更新
<img src="https://i.imgur.com/ValBPwv.gif" />

### 收尋功能
<img src="https://i.imgur.com/Zly8z2l.jpg" />

### 巢狀路由/ 阻擋會員路由
阻擋使用者在未登入時無法瀏覽首頁、個人頁、發表文章等頁面

