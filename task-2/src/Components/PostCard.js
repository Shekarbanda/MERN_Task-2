import React, { useEffect, useState } from "react";
import p1 from '../Images/car.png';
import '../Styles/PostCard.css';
import { FaThumbsUp, FaComment, FaSave, FaShare } from 'react-icons/fa';
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

export default function PostCard() {
  const [isContentExpanded, setContentExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [allposts, setAllPosts] = useState([]);
   const url = useSelector((state)=>state.backend.url);
  const isuser = useSelector((state)=>state.user.value);
  const [user,setuser] = useState(null);
  const [likedByUser, setLikedByUser] = useState(false);
  const [expandedContentId, setExpandedContentId] = useState(null); // For expanded content
  const [commentsVisibleId, setCommentsVisibleId] = useState(null); 

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts,setposts] = useState(null)

  const postsall = useSelector((state)=>state.posts.allp);
      
        useEffect(() => {
          setuser(isuser);
          setAllPosts(postsall);
          
        }, [isuser,postsall]);

        const toggleContent = (postId) => {
          setExpandedContentId((prevId) => (prevId === postId ? null : postId));
        };
      
        // Toggle comment visibility
        const toggleComments = (postId) => {
          setCommentsVisibleId((prevId) => (prevId === postId ? null : postId));
        };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Handle adding a comment to a post
      handleComment(postId);
      setNewComment("");
    }
  };

  const [loading, setLoading] = useState(true);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${url}/api/posts`);  // Replace with your backend URL
        setAllPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [[postsall]]);

  // Like a post
 // Like a post
const handleLike = async (postId) => {
  try {
    const userId = user._id; // Replace with actual user ID
    const response = await axios.put(`${url}/api/posts/like/${postId}`, { userId });

    // Update posts state
    const updatedPosts = allposts.map((post) =>
      post._id === postId
        ? {
            ...post,
            likes: response.data.post.likes, // Update likes array from server response
          }
        : post
    );

    setAllPosts(updatedPosts);

    // Update like state for the specific post
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


  // Add comment to a post
  const handleComment = async (postId) => {
    try {
      await axios.post(`${url}/api/posts/comment/${postId}`, {
        userId: user._id, // Replace with actual userId
        comment: newComment,
      });

      // Update posts state to reflect the new comment
      const updatedPosts = allposts.map(post =>
        post._id === postId
          ? {
              ...post,
              comments: Array.isArray(post.comments) // Ensure comments is an array
                ? [...post.comments, { userId: user?._id, comment: newComment }] // Append the new comment
                : [{ userId: user?._id, comment: newComment }] // Initialize as array if not already
            }
          : post
      );
      setAllPosts(updatedPosts);
      setposts(updatedPosts)
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

   


  return (
    loading?<p className="h-100 d-flex justify-content-center align-items-center">Loading Posts....</p>:
    
    allposts?.length==0?<p>...No posts Yet....</p>:allposts?.map((post) => (
        <div key={post._id} className="card mt-4">
          {/* Header: Profile and Share Button */}
          <div className="header px-3 pt-2">
            <div className="profile-section">
              <img alt="Author" src={post.authorImage ? `${url}${post.authorImage}` : p1}   onError={(e) => {
    e.target.src = p1; // Fallback to default image on error
  }} className="profile-image" />
              <span className="author-name">{post.author.name==user?.name?`${user?.name} (My Post)`:post?.author?.name}</span>
            </div>
            <button className="share-button"><FaShare /> <span className="d-none d-md-inline">Share</span></button>
          </div>

          {/* Title */}
          <small style={{ fontSize: '20px', paddingLeft: '15px' }} className="fw-medium text-black">{post?.postType}</small>
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

          {/* Image */}
          {
            post?.image.length!=0 && (
              <img
  src={post.image ? `${url}${post.image}` : p1} // Dynamically set the image source
  alt="Post"
  className="post-image"
  width={650}
  height={220}
  onError={(e) => {
    e.target.src = p1; // Fallback to default image on error
  }}
/>
            )
          }

          {/* Actions: Like, Comment, Save */}
          <div className="px-3 actions">
            <button className="action-button" onClick={() =>{ handleLike(post._id);setLikedByUser(!likedByUser)}} >
              <FaThumbsUp className="mb-1 " /><span className="d-inline d-md-none">({Array.isArray(post.likes) ? post.likes.length : 0})</span>
  <span className="d-none d-md-inline">
    Like ({Array.isArray(post.likes) ? post.likes.length : 0})
  </span>
            </button>
            <button className="action-button" onClick={() => toggleComments(post._id)}>
              <FaComment className="mb-1" /> <span className="d-none d-md-inline">Comment</span>
            </button>
            
          </div>

          {/* Comments Section */}
          {commentsVisibleId === post._id  && (
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

              {/* Display Comments */}
              <div className="comment-list">
                {post?.comments && post?.comments.map((comment, index) => (
                  <div key={index} className="comment-item d-flex flex-column">
                    <div className="profile-section d-flex">
                      <img src={comment?.userImage ? `${url}${comment?.userImage}` : p1} alt="Author" className="profile-image" />
                      <span className="author-name">{comment?.userName}</span>
                    </div>
                    <span className="comment-text">{comment?.comment}</span>
                    {/* <button
                      className="like-comment-button"
                      // onClick={() => onLike(comment.id)} // If you're handling likes for comments
                    >
                      Like (0) Implement likes for comments if needed
                    </button> */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))
    
  );
}
