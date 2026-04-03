import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Spinner from "../layout/Spinner.js";
import PostItem from "../posts/PostItem.js";
import { getPost } from "../../actions/post";
import CommentForm from "./CommentForm.js";
import CommentItem from "./CommentItem.js";
const Post = ({ post: { post, loading }, getPost }) => {
  const { postId } = useParams();
  useEffect(() => {
    if (postId) {
      getPost(postId);
    }
  }, [getPost, postId]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link to="/posts" className="btn">
        Back to posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ post: state.post });
export default connect(mapStateToProps, { getPost })(Post);
