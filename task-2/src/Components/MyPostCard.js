import React, { useEffect, useState } from "react";
import p1 from '../Images/car.png';
import '../Styles/PostCard.css';
import { FaThumbsUp, FaComment, FaSave, FaShare } from 'react-icons/fa';
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { isedit, setEditPost } from "../Redux/Slices/EditPostSlice";
import { seteditpost } from "../Redux/Slices/AllPostsSlice";
import { setmyp } from "../Redux/Slices/PostsSlice";

export default function MyPostCard() {
  const [isContentExpanded, setContentExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [allposts, setAllPosts] = useState([]);
  const url = useSelector((state) => state.backend.url);
  const isuser = useSelector((state) => state.user.value);
  const [user, setuser] = useState(null);
  const [likedByUser, setLikedByUser] = useState(false);
  const [expandedContentId, setExpandedContentId] = useState(null);
  const [commentsVisibleId, setCommentsVisibleId] = useState(null);
  const dispatch = useDispatch();

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setposts] = useState(null)

  const postsall = useSelector((state) => state.posts.allp);
  const postsmy = useSelector((state) => state.posts.myp);

  useEffect(() => {
    setuser(isuser);
    setAllPosts(postsmy);

  }, [isuser, postsall, postsmy]);

  const toggleContent = (postId) => {
    setExpandedContentId((prevId) => (prevId === postId ? null : postId));
  };


  const toggleComments = (postId) => {
    setCommentsVisibleId((prevId) => (prevId === postId ? null : postId));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (newComment.trim()) {

      handleComment(postId);
      setNewComment("");
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log(user?.name)
      try {
        const response = await axios.post(`${url}/api/posts/myposts`, {
          userId: user?._id,
        });
        setAllPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);


  const handleLike = async (postId) => {
    try {
      const userId = user._id;
      const response = await axios.put(`${url}/api/posts/like/${postId}`, { userId });


      const updatedPosts = allposts.map((post) =>
        post._id === postId
          ? {
            ...post,
            likes: response.data.post.likes,
          }
          : post
      );

      setAllPosts(updatedPosts);


      setLikedPosts((prev) => {
        const updatedLikes = new Set(prev);
        if (updatedLikes.has(postId)) {
          updatedLikes.delete(postId);
        } else {
          updatedLikes.add(postId);
        }
        return updatedLikes;
      });
    } catch (error) {
      console.error("Error liking post", error);
    }
  };



  const handleComment = async (postId) => {
    try {
      await axios.post(`${url}/api/posts/comment/${postId}`, {
        userId: user._id,
        comment: newComment,
      });

      const updatedPosts = allposts.map(post =>
        post._id === postId
          ? {
            ...post,
            comments: Array.isArray(post.comments)
              ? [...post.comments, { userId: user?._id, comment: newComment }]
              : [{ userId: user?._id, comment: newComment }]
          }
          : post
      );
      setAllPosts(updatedPosts);
      setposts(updatedPosts)
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const fetchPosts = async () => {

    try {
      const response = await axios.post(`${url}/api/posts/myposts`, {
        userId: user?._id,
      });
      dispatch(setmyp(response.data.posts));

    } catch (err) {
      console.log(err)

    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(`${url}/api/posts/delete/${postId}`);


      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
    fetchPosts();
  };

  return (
    loading ? <p className="h-100 d-flex justify-content-center align-items-center">Loading Posts....</p> :

      allposts?.length == 0 ? <p>...No posts Yet....</p> : allposts?.map((post) => (
        <div key={post?._id} className="card mt-4">

          <div className="header px-3 pt-2">
            <div className="profile-section">
              <img alt="Author" src={user?.profile ? `${url}${user?.profile}` : p1} onError={(e) => {
                e.target.src = p1;
              }} className="profile-image" />
              <span className="author-name">{post.author == user._id ? `${user?.name} (My Post)` : post?.author?.name}</span>
            </div>
            <button className="share-button"><FaShare /> <span className="d-none d-md-inline">Share</span></button>
          </div>

          {/* Title */}
          <small style={{ fontSize: '20px', paddingLeft: '15px' }} className="fw-medium text-black">{post?.postType ? post.postType : "Job"}</small>
          <h2 className="px-3 title fw-bold">{post.title}</h2>

          {/* Content */}
          <p className="px-3 content">
            {expandedContentId === post._id
              ? post.content
              : `${post.content.substring(0, 70)}`}
            {post.content.length > 70}`
            {post.content.length > 100 && (
              <button className="more-button" onClick={() => toggleContent(post._id)}>
                {expandedContentId === post._id ? "...less" : "...more"}
              </button>
            )}
          </p>

          {
            post?.image.length != 0 && (
              <img
                src={post.image ? `${url}${post.image}` : p1}
                alt="Post"
                className="post-image"
                width={650}
                height={220}
                onError={(e) => {
                  e.target.src = p1;
                }}
              />
            )
          }

          {/* Actions: Like, Comment, Save */}
          <div className="px-3 actions">
            <button className="action-button" onClick={() => { handleLike(post._id); setLikedByUser(!likedByUser) }} >
              <FaThumbsUp className="mb-1 " /><span className="d-inline d-md-none">({Array.isArray(post.likes) ? post.likes.length : 0})</span>
              <span className="d-none d-md-inline">
                Like ({Array.isArray(post.likes) ? post.likes.length : 0})
              </span>
            </button>
            <button className="action-button" onClick={() => toggleComments(post._id)}>
              <FaComment className="mb-1" /> <span className="d-none d-md-inline">Comment</span>
            </button>

          </div>
          <div className="px-3 actions">
            <button className="action-button" onClick={() => { console.log(post); dispatch(seteditpost(post)); dispatch(isedit(true)); }}>Edit</button>
            <button className="action-button" onClick={() => handleDelete(post?._id)}>Delete</button>
          </div>

          {/* Comments Section */}
          {commentsVisibleId === post._id && (
            <div className="px-3 comments-section">
              <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="comment-form">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="comment-input"
                />
                <button type="submit" className="rounded-5 bg-primary comment-submit-button">
                  Comment
                </button>
              </form>

              <div className="comment-list">
                {post?.comments && post?.comments.map((comment, index) => (
                  <div key={index} className="comment-item d-flex flex-column">
                    <div className="profile-section d-flex">
                      <img src={comment?.userImage ? `${url}${comment?.userImage}` : p1} alt="Author" className="profile-image" />
                      <span className="author-name">{comment?.userName}</span>
                    </div>
                    <span className="comment-text">{comment?.comment}</span>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))

  );
}
