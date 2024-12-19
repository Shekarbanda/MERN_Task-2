import React, { useEffect, useState } from "react";
import "../Styles/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { ischeck } from "../Redux/Slices/PopupSlice";
import { islogin } from "../Redux/Slices/LoginSlice";
import '../Styles/Edit.css'
import { isedit } from "../Redux/Slices/EditPostSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { setallp, setmyp } from "../Redux/Slices/PostsSlice";

export default function EditPost() {
  const [showPopup, setShowPopup] = useState("");
  const count = useSelector((state) => state.edit.value);
  const dispatch = useDispatch();
  const url = useSelector((state)=>state.backend.url);
  
  const editPost = useSelector((state) => state.editpost?.value);
  const isuser = useSelector((state)=>state.user.value);
    const [user,setuser] = useState(null);

    

  const [formData, setFormData] = useState({
    title: editPost?.title || "",
    content: editPost?.content || "",
    type: editPost?.type || "Article", // Default value is set to 'Article'
    image: editPost?.image || null, // Initialize image with the current image or null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0], // Store the file object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("type", formData.type);

    // Only append the image if it exists (file is uploaded)
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axios.put(`${url}/api/posts/update/${editPost._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      toast.success("Post updated successfully!");
      dispatch(setallp(response.data.posts))
      // Close the popup after successful update
      closePopup();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update the post.");
    }
    fetchPosts();
  };

  const fetchPosts = async () => {
    
  try {
    const response = await axios.post(`${url}/api/posts/myposts`, {
        userId: user?._id,
      }); // Replace with your backend URL
    dispatch(setmyp(response.data.posts));

  } catch (err) {
    console.log(err)
    toast.error("Error fetching posts");
 
  }
};

  const openPopup = (type) => setShowPopup(type);

  const closePopup = () => {
    dispatch(isedit(false));
    setShowPopup("");
  };

  // Update form data when editPost changes
  useEffect(() => {
    if (count) openPopup("edit");
    setuser(isuser)
    
    setFormData({
      title: editPost?.title || "",
      content: editPost?.content || "",
      type: editPost?.type || "Article", // Default 'Article' if no type
      image: editPost?.image || null, // Initialize with current image or null
    });
  }, [count, editPost,isuser]);

  return (
    <div className="container" style={{ zIndex: "20000" }}>
      {showPopup && (
        <div className="overlay fade-in" onClick={closePopup}></div>
      )}

      {showPopup === "edit" && (
        <div className={`popup1 ${showPopup ? "popup-show" : "popup-hide"}`}>
          <button
            className="btn-close py-4 px-4 position-absolute top-0 end-0 m-2"
            onClick={closePopup}
          ></button>

          <div className="smlogin d-flex flex-column gap-3" style={{ padding: "30px" }}>
            <div>
              <h3 className="text-black fw-bold mb-4">Edit Post</h3>
              <form style={{ fontSize: "14px" }} onSubmit={handleSubmit}>
                <select
                  style={{ height: '50px', fontSize: '15px' }}
                  className="w-100 mb-2 filter cursor-pointer"
                  name="type" // Bind the type state with the 'name' attribute
                  value={formData.type} // Bind 'type' state
                  required
                  onChange={handleInputChange} // Handle change
                >
                  <option value="" disabled>Select Post Type</option>
                  <option value="Article">✍️ Article</option>
                  <option value="Education">🔬️ Education</option>
                  <option value="Job">💼️ Job</option>
                </select>

                <input
                  type="text"
                  className="form-control w-100 mb-2"
                  name="title"
                  placeholder="Enter Title"
                  value={formData.title} // Bind title state
                  required
                  onChange={handleInputChange} // Handle title change
                />

                <textarea
                  rows={4}
                  className="form-control w-100 mb-2"
                  name="content"
                  placeholder="Enter Content"
                  required
                  value={formData.content} // Bind content state
                  onChange={handleInputChange} // Handle content change
                />

                <div className="position-relative">
                  <label htmlFor="pic">Upload image</label>
                  <input
                    type="file"
                    id="pic"
                    className="form-control mb-4 p-2"
                    onChange={handleImageChange} // Handle image change
                  />
                </div>

                <div className="w-100 resp d-flex justify-content-between align-items-center mx-auto">
                  <button type="submit" className="subbtn btn btn-primary rounded-5 mb-4">
                    Update
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
