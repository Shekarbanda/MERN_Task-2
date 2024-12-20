import React, { useEffect, useRef, useState } from "react";
import "../Styles/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { ischeck } from "../Redux/Slices/PopupSlice";
import { islogin } from "../Redux/Slices/LoginSlice";
import '../Styles/Edit.css'
import toast from "react-hot-toast";
import axios from "axios";
import { isedit } from "../Redux/Slices/EditPostSlice";
import { setuser } from "../Redux/Slices/UserSlice";

export default function ProfileEdit() {
  const [showPopup, setShowPopup] = useState("");
  const count = useSelector((state) => state.check.value);
  const dispatch = useDispatch();
  const url = useSelector((state) => state.backend.url);
  const user = useSelector((state) => state.user.value);
  const [id, setid] = useState('');

  useEffect(() => {
    setid(user?._id);

  }, [user])

  const [load, setLoad] = useState(false);


  const [formData, setFormData] = useState({
    id: id,
    name: '',
    profession: '',
    city: '',
    profile: null,
  });

  const initialFormData = {
    id: id,
    name: '',
    profession: '',
    city: '',
    profile: null,
  };

  useEffect(() => {
    if (user && user._id) {
      setFormData({
        ...formData,
        id: user._id,
      });
    }
  }, [user]);


  const resetButtonRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    setLoad(true);
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('id', formData.id)
      data.append('name', formData.name);
      data.append('profession', formData.profession);
      data.append('city', formData.city);

      if (formData.profile) {
        data.append('profile', formData.profile);
      }

      const response = await axios.post(`${url}/api/user/editprofile`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.status === 200) {
        setFormData(initialFormData);
        if (resetButtonRef.current) {
          resetButtonRef.current.click();
        }
        dispatch(setuser(response.data.user))
        closePopup()
        toast.success("Successfully Updated");

      }
      else {
        closePopup()
        toast.error("Failed to Update");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoad(false);
    }
  };



  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  const openPopup = (type) => setShowPopup(type);

  const closePopup = () => {
    dispatch(ischeck(false));
    setShowPopup("");
  };

  useEffect(() => {
    if (count) openPopup("edit");
  }, [count]);

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

          <div
            className="smlogin d-flex flex-column gap-3"
            style={{ padding: "30px" }}
          >
            <div className="">
              <h3 className="text-black fw-bold mb-4">Edit Profile</h3>
              <form
                style={{ fontSize: "14px" }}
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  className="form-control w-100 mb-2"
                  placeholder="Username"
                  name="name" value={formData.name}
                  onChange={handleChange} required
                />
                <input
                  type="text"
                  className="form-control w-100 mb-2"
                  placeholder="city"
                  value={formData.city}
                  name="city" onChange={handleChange} required
                />

                <input
                  type="text"
                  className="form-control p-2 mb-2"
                  placeholder="Profession"
                  value={formData.profession}
                  name="profession" onChange={handleChange} required
                />
                <div className="position-relative">
                  <label for='profile'>Upload Profile Pic</label>
                  <input
                    type="file"
                    id="profile"
                    className="form-control mb-4 p-2"
                    placeholder="Profile Pic"
                    required
                    name="profile" onChange={handleImageChange}
                  />
                </div>
                <div className="w-100 resp d-flex justify-content-between align-items-center mx-auto">
                  <button
                    type="submit"
                    className="subbtn btn btn-primary rounded-5 mb-4"
                  >
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
