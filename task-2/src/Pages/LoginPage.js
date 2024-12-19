import React, { useEffect, useState } from "react";
import  "../Styles/Login.css";
import loginimg from '../Images/login_img.png'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavbarStart from "../Components/NavbarStart";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import ForgotPass from "../Components/ForgotPass";
import { setisforgot } from "../Redux/Slices/UserSlice";

export default function LoginPage() {
    const navigate = useNavigate();
    const [password, setpassword] = useState("");
    const [name, setname] = useState("");
    const url = useSelector((state) => state.backend.url);
    const [loading,setloading] = useState(false);
    const dispatch = useDispatch();
    

const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    async function loginhandler(e) {
        setloading(true);
        e.preventDefault();
       const user = { name, password };
      
        
        try {
          const login = await axios.post(`${url}/api/login`, user, {
            withCredentials: true
          });
    
          if (login.data.success) {
            const user = login.data.user;
            
            toast.success(`${login.data.message} ${user.name}`);
            navigate('/');
          }
          else {
            toast.error(login.data.message);
          }
        }
        catch (err) {
          toast.error(err.message);
        }
        finally {
          setloading(false);
          setname("");
          setpassword("");
        }
      }

  return (
    <>
        <NavbarStart/>
        <ForgotPass/>
    <div className="container" style={{zIndex:"20000"}}>
        
        <div className="popup">
        <img className="logimg1 showmob" height={300} src={loginimg}/>
          <h4 className="reg text-center" style={{color:'#008A45',fontSize:'14px',backgroundColor:'#EFFFF4',height:'50px',padding:'30px',borderRadius: '10px'}}>Let's learn, share & inspire each other with our passion for computer engineering. Sign up now 🤘🏼</h4>
          <div className="smlogin d-flex gap-3" style={{padding:"30px"}}>
            <div className="smallp">
                <h3 className="text-black fw-bold mb-4">Sign In</h3>
                <form style={{fontSize:'14px'}} onSubmit={loginhandler}>
                    
                        <input type="text" required value={name} onChange={(e)=>setname(e.target.value)} className="form-control w-100 mb-2" placeholder="Username" />

                    <div className="position-relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password} onChange={(e)=>setpassword(e.target.value)}
                    className="form-control mb-4 p-2 "
                    placeholder="Password"
                    required
                />
                {/* Show/Hide Password Button */}
                <span
                    onClick={togglePasswordVisibility}
                    className="position-absolute"
                    style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#0d6efd",
                    }}
                >
                    {showPassword ? (
                        <FaEyeSlash size={18} color="#0d6efd" />
                    ) : (
                        <FaEye size={18} color="#0d6efd" />
                    )}
                </span>
            </div>
                    
                    <div className="resp d-flex justify-content-between align-items-center ">
                        <button type="submit" style={{marginRight:'30px'}} className="subbtn btn btn-primary rounded-5 mb-4">{loading?"Loading...it takes upto 2min":"Sign In"}</button>
                        <p className="mobmsg link" onClick={()=>navigate('/signup')}>Or, Create Account</p>
                        
                    </div>
                    
                    <div className="text-center">
                       
                        <span className="cursor-pointer pb-4" onClick={()=>dispatch(setisforgot(true))}>Forgot Password</span>
                    </div>
                </form>
            </div>
            <div className="d-flex flex-column text-center" style={{width:'320px'}}>
                <p className="logimg" style={{fontSize:"13px"}}>
                Don’t have an account yet? <span className="link fw-medium" onClick={()=>navigate('/signup')}>Create new for free!</span>
                    </p>
                <img className="logimg" width={320} height={300} src={loginimg}/>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};
