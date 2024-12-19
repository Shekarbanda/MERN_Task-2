import React, { useEffect, useRef, useState } from "react";
import logo from "../Images/whole.png";
import searchicon from "../Images/Vector.png";
import "../Styles/Navbar.css";
import p1 from "../Images/car.png";
import { FaMapMarkerAlt, FaBriefcase, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ischeck } from "../Redux/Slices/PopupSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isprofile, setisprofile] = useState(false);
  const dispatch = useDispatch();
  const cardRef = useRef(null); // Ref for the profile card
  const buttonRef = useRef(null); // Ref for the button
  const navigate = useNavigate();
  const url = useSelector((state)=>state.backend.url);
  const isuser = useSelector((state)=>state.user.value);
  const [user,setuser] = useState(null)
  const nav = useNavigate();

  const [imgSrc, setImgSrc] = useState(null);
  
    useEffect(() => {
      setuser(isuser);
      // Set the image src initially to the user's profile image or a default image
      if (isuser?.profile) {
        setImgSrc(`http://localhost:8000${isuser?.profile}`);
      } else {
        setImgSrc(p1); // Set the default image if the user doesn't have a profile image
      }
    }, [isuser]);
  
    const handleImageError = () => {
      setImgSrc(p1); // Fallback to default image if there's an error loading the profile image
    };

  // Handle clicks outside the profile card
  const handleClickOutside = (event) => {
    if (
      cardRef.current &&
      !cardRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setisprofile(false);
    }
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

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{ maxWidth: "1200px", paddingBottom: "20px" }}
      className="container px-2 m-0 mx-auto navbar d-flex justify-content-between align-items-center"
    >
      {/* Logo */}
      <img src={logo} className="cursor-pointer" width="162.57px" height="24px" alt="Logo" />

      {/* Search Bar */}
      <div className="searchbar d-lg-block d-none">
        <img alt="Search" className="search-icon cursor-pointer" src={searchicon} />
        <input className="search" type="text" placeholder="Search for your favorite groups in ATG" />
      </div>

      {/* Profile Section */}
      <div className="create-account d-flex align-items-center justify-content-end" style={{ position: "relative" }}>
        <button
          ref={buttonRef}
          onClick={() => setisprofile((prev) => !prev)}
          className="d-inline d-lg-none"
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          <img src={imgSrc}
            onError={handleImageError} alt="Author" className="profile-image d-inline d-lg-none" />
          <div className="drop">▼</div>
        </button>
        <button className="btn custom-btn-create p-2 m-0 d-none d-lg-block">
          <span className="text-primary fw-bold" onClick={logouthandler}>Logout</span>
        </button>
        <div className="drop d-none d-lg-block">▼</div>

        {/* Profile Card */}
        {isprofile && (
          <div
            ref={cardRef}
            className="card shadow-lg position-fixed"
            style={{
              width: "300px",
              right:'15px', // Align to left of parent
              top: "60px", // Show below the button
              zIndex: 1000,
            }}
          >
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

          
            
          </div>
        )}
      </div>
    </div>
  );
}
