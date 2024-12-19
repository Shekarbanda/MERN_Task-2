import React, { forwardRef, useEffect, useState } from "react";
import p1 from '../Images/car.png';
import { FaMapMarkerAlt, FaBriefcase, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ischeck } from "../Redux/Slices/PopupSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProfileCard()  {
   
    const edit = useSelector((state)=>state.edit.value);
  const dispatch = useDispatch();
const nav = useNavigate();
  const login = useSelector((state) => state.login.value);
  const navigate = useNavigate();
    const url = useSelector((state)=>state.backend.url);
  
  const isuser = useSelector((state)=>state.user.value);
  const [user,setuser] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading,setloading] = useState(true);
  setTimeout(()=>{
    setloading(false);
  },1000)
  useEffect(() => {
    setuser(isuser);
    // Set the image src initially to the user's profile image or a default image
    if (isuser?.profile) {
      setImgSrc(`http://localhost:8000${isuser?.profile}`);
      
    } else {
      setImgSrc(p1);
       // Set the default image if the user doesn't have a profile image
    }
  }, [isuser]);

  const handleImageError = () => {
    setImgSrc(p1); 
    setloading(false)// Fallback to default image if there's an error loading the profile image
  };

  async function logouthandler() {
    try {
        const logout = await axios.get(`${url}/api/logout`);
        
        if (logout.data.success) {
            toast.success(logout.data.message);
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            navigate('/login');
        }
    } catch (err) {
        toast.error(err.message);
    }
}

  return (
    loading?<p></p>:
    <div style={{zIndex:'100'}} className="container mt-4">
      {/* Profile Card */}
      <div className="card shadow-lg" style={{ width:'300px',axWidth: "400px", margin: "auto" }}>
        {/* Header */}
        <div className="card-header text-center text-black">
          <img
            src={imgSrc}
            onError={handleImageError}
            alt="Profile"
            className="rounded-circle mb-2"
            style={{ width: "60px", height: "60px" }}
          />
          <h5 className="card-title mb-0">{user?.name}</h5>
          <small>{user?.profession}</small>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Location */}
          <div className="d-flex align-items-center mb-2">
            <FaMapMarkerAlt className="me-2 text-secondary" />
            <span>{user?.city}</span>
          </div>

          {/* Profession */}
          <div className="d-flex align-items-center mb-2">
            <FaBriefcase className="me-2 text-secondary" />
            <span>{user?.profession}</span>
          </div>

          {/* Friends & Views */}
          <div className="d-flex flex-column">
            <p className="link" onClick={()=>dispatch(ischeck(true))}>Edit Profile</p>
            <p className="link" onClick={()=>nav('/myposts')}>My Posts</p>
            <p className="link" onClick={()=>nav('/')}>All Posts</p>
            <p className="link" onClick={logouthandler}>Logout</p>
          </div>
        </div>

        {/* Social Profiles */}
       
     
      </div>
    </div>
  );
}