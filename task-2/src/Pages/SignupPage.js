import React, { useEffect, useState } from "react";
import  "../Styles/Login.css";
import loginimg from '../Images/login_img.png'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavbarStart from "../Components/NavbarStart";
import { useDispatch, useSelector } from "react-redux";
import { islogin } from "../Redux/Slices/LoginSlice";
import toast from 'react-hot-toast';
import axios from 'axios';

export default function SignupPage() {
  
const nav = useNavigate();
const dispatch = useDispatch();
const url = useSelector((state) => state.backend.url);
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [loading,setloading] = useState(false)

  useEffect(() => {
    dispatch(islogin(name))
  }, [])

  async function signuphandler(e) {
    setloading(true);
    e.preventDefault();
    const user = { name, email, password };
    console.log(name,email)

    try {
      const signup = await axios.post(`${url}/api/signup`, user);
      if (signup.data.success) {
       
        toast.success(signup.data.message);
        navigate('/login');

      }
      else {
        toast.error(signup.data.message);
      
      }
    }
    catch (err) {
      toast.error(err.message);
    }
    finally {
      setemail("");
      setpassword("");
      setloading(false);
    }
  }


    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

  return (
    <>
        <NavbarStart/>
    <div className="container" style={{zIndex:"20000"}}>
        <div className="popup">
        <img className="logimg1 showmob" height={250} src={loginimg}/>
          <h4 className="reg text-center" style={{color:'#008A45',fontSize:'14px',backgroundColor:'#EFFFF4',height:'50px',padding:'30px',borderRadius: '10px'}}>Let's learn, share & inspire each other with our passion for computer engineering. Sign up now 🤘🏼</h4>
          <div className="smlogin d-flex gap-3" style={{padding:"30px"}}>
            <div className="smallp">
                <h3 className="text-black fw-bold mb-4">Create Account</h3>
                <form onSubmit={signuphandler} style={{fontSize:'14px'}} >
                    
                    <input type="text" required className="form-control w-100 mb-2" value={name} onChange={(e)=>setname(e.target.value)} placeholder="Username" />
                    
                    <input type="email" required className="form-control p-2 mb-2" value={email} onChange={(e)=>setemail(e.target.value)} placeholder="Email" />
                    <div className="position-relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="form-control mb-4 p-2 "
                    placeholder="Password"
                    value={password} onChange={(e)=>setpassword(e.target.value)}
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
                        <button type="submit" style={{marginRight:'30px'}} className="subbtn btn btn-primary rounded-5 mb-4">{loading?"Loading... it may take upto 1min":"Create Account"}</button>
                        <p className="mobmsg link" onClick={()=>nav('/login')}>Or, Sign In</p>
                    </div>
                    
                    <div className="text-center">
                       
                        <span className="forgot pb-4">By signing up, you agree to our Terms & conditions, Privacy policy</span>
                    </div>
                </form>
            </div>
            <div className="d-flex flex-column text-center" style={{width:'320px'}}>
                <p className="logimg" style={{fontSize:"13px"}}>
                Already have an account? <span className="link fw-medium" onClick={()=>nav('/login')}>Sign In</span>
                    </p>
                <img className="logimg" width={320} height={320} src={loginimg}/>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};
