import React, { useEffect, useState } from "react";
import  "../Styles/Login.css";
import loginimg from '../Images/login_img.png'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavbarStart from "../Components/NavbarStart";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { setisforgot } from "../Redux/Slices/UserSlice";

export default function ForgotPass() {
    const navigate = useNavigate();
    const [email, setemail] = useState("");
    const [showPopup, setShowPopup] = useState("");
    const isfor = useSelector((state)=>state.user.isforgot);
    const url = useSelector((state)=>state.backend.url);
  
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();
      
    
        try {
          const response = await axios.post(`${url}/api/user/forgot-password`, { email });
          toast.success(response.data.message);
        } catch (error) {
          console.error("Error sending reset email:", error);
          toast.error("Failed to send reset email");
        } finally {
          
        }
      };

  const openPopup = (type) => setShowPopup(type);
  
    const closePopup = () => {
      dispatch(setisforgot());
      setShowPopup("");
    };
  
    useEffect(() => {
      if (isfor) openPopup("forgot");
    }, [isfor]);
  
    return (
      <div className="container" style={{ zIndex: "200000" }}>
        {/* Overlay with fade-in animation */}
        {showPopup && (
          <div className="overlay fade-in" onClick={closePopup}></div>
        )}
  
        {/* Popup Content */}
        {showPopup === "forgot" && (
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
                <h3 className="text-black fw-bold mb-4">Reset Password</h3>
                <form
                  style={{ fontSize: "14px" }}
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    className="form-control w-100 mb-2"
                    placeholder="Enter Email"
                    name="name" value={email}
                    onChange={(e)=>setemail(e.target.value)} required
                  />
                  
                  <div className="w-100 resp d-flex justify-content-between align-items-center mx-auto">
                    <button
                      type="submit"
                      className="subbtn btn btn-primary rounded-5 mb-4"
                    >
                      Get Reset Link
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
  
  

