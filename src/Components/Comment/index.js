import React from "react";

// 路由
import { Link } from "react-router-dom";

const Comment = (props) => {
  return (
    <div className="comment__item">
      <div className="comment__user">
        <Link
          className="comment__imageBox"
          to={"/posts/" + props.comment.author.username}
        >
          <div className="imgbox">
            <div className="imgbox-inner">
              <div
                className="image"
                style={{
                  backgroundImage: `url(${props.comment.author.photoURL})`,
                }}
              ></div>
            </div>
          </div>
        </Link>
        <Link
          to={"/posts/" + props.comment.author.username}
          className="comment__username"
        >
          {props.comment.author.username}
        </Link>
      </div>
      <div className="comment__info">
        <div> {props.comment.content}</div>
      </div>
    </div>
  );
};

export default Comment;
