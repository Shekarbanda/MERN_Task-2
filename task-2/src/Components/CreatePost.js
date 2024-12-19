import React, { useEffect, useState } from "react";
import "../Styles/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { islogin } from "../Redux/Slices/LoginSlice";
import '../Styles/Edit.css'
import { iscreate } from "../Redux/Slices/CreatePostSlice";
import axios from 'axios'; // You need axios to make HTTP requests
import toast from "react-hot-toast";
import { setallp } from "../Redux/Slices/PostsSlice";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [showPopup, setShowPopup] = useState("");
  const [type,settype] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // Store the image file
  const count = useSelector((state) => state.create.value);
  const dispatch = useDispatch();
  const url = useSelector((state)=>state.backend.url);
    const isuser = useSelector((state)=>state.user.value);
    const [user,setuser] = useState(null)
    const nav = useNavigate()
    
      useEffect(() => {
        setuser(isuser);
        
      }, [isuser]);
    
  

  const openPopup = (type) => setShowPopup(type);

  const closePopup = () => {
    dispatch(iscreate(false));
    setShowPopup("");
  };

  useEffect(() => {
    if (count) openPopup("edit");
  }, [count]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId',user?._id);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('postType',type)
    if(image)
      formData.append('image', image); // 'profile' is the key in the backend form

    try {
      // Make POST request to backend
      const response = await axios.post(`${url}/api/posts`, formData, {
        withCredentials:true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // console.log('Post created:', response.data);
      toast.success("Post Successfully Created");
      closePopup();
      nav('/')
      dispatch(islogin(true)); // Dispatch any other necessary actions

    } catch (error) {
      toast.error('Error creating post');
      console.log(error)
      // You can handle errors here
    }

    fetchPosts();
  };

  const fetchPosts = async () => {
    
    try {
      const response = await axios.post(`${url}/api/posts/myposts`, {
          userId: user?._id,
        }); // Replace with your backend URL
      dispatch(setallp(response.data.posts));
  
    } catch (err) {
      console.log(err)
      toast.error("Error fetching posts");
   
    }
  };

  return (
    <div className="container" style={{ zIndex: "20000" }}>
      {/* Overlay with fade-in animation */}
      {showPopup && (
        <div className="overlay fade-in" onClick={closePopup}></div>
      )}

      {/* Popup Content */}
      {showPopup === "edit" && (
        <div className={`popup1 ${showPopup ? "popup-show" : "popup-hide"}`}>
          <button
            className="btn-close py-4 px-4 position-absolute top-0 end-0 m-2"
            onClick={closePopup}
          ></button>

          <div
            className="smlogin d-flex flex-column gap-3"
            style={{ padding: "30px" }}
          >
            <div className="">
              <h3 className="text-black fw-bold mb-4">Create Post</h3>
              <form
                style={{ fontSize: "14px" }}
                onSubmit={handleSubmit} // Handle form submission
              >
                <select
                  style={{ height: '50px', fontSize: '15px' }}
                  className='w-100 mb-2 filter cursor-pointer'
                  required
                  onChange={(e) => settype(e.target.value)} // Handle title change
                >
                  <option selected disabled>Post Type</option>
                  <option>✍️ Article</option>
                  <option>🔬️ Education</option>
                  <option>💼️ Job</option>
                </select>

                <input
                  type="text"
                  className="form-control w-100 mb-2"
                  placeholder="Enter Title"
                  value={title} // Bind title state
                  required
                  onChange={(e) => setTitle(e.target.value)} // Handle title change
                />

                <textarea
                  rows={4}
                  className="form-control w-100 mb-2"
                  placeholder="Enter Content"
                  required
                  value={content} // Bind content state
                  onChange={(e) => setContent(e.target.value)} // Handle content change
                />

                <div className="position-relative">
                  <label htmlFor='pic'>Upload image</label>
                  <input
                    type="file"
                    id="pic"
                    className="form-control mb-4 p-2"
                    onChange={(e) => setImage(e.target.files[0])} // Handle file change
                  />
                </div>

                <div className="w-100 resp d-flex justify-content-between align-items-center mx-auto">
                  <button
                    type="submit"
                    className="subbtn btn btn-primary rounded-5 mb-4"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
