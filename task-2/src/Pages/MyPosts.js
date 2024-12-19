import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar';
import MyPostMenu from '../Components/MyPostMenu';
import Posts from '../Components/Posts';
import PostCard from '../Components/PostCard';
import ProfileEdit from '../Components/ProfileEdit';
import CreatePost from '../Components/CreatePost';
import EditPost from '../Components/EditPost';
import { iscreate } from '../Redux/Slices/CreatePostSlice';
import { useDispatch, useSelector } from 'react-redux';
import edit from '../Images/edit_24px.png'
import { setuser } from '../Redux/Slices/UserSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from '../Components/Footer';

export default function MyPosts() {
    const url = useSelector((state) => state.backend.url);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const create = useSelector((state) => state.create.value);
    const isuser = useSelector((state)=>state.user.value);

    useEffect(() => {
        is_login();
      
      
    }, []);

    async function is_login() {
        try {
            const is_user = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (!is_user.data.success) {
                navigate('/login');
            
            } else {
                dispatch(setuser(is_user.data.user));
              
            }
        } catch (err) {
            navigate('/login');
            toast.error(err.message);
        }
    }

   
  return (
    <div className='w-100' style={{width:'100vw',height:'100vh'}}>
            <button className='edit' onClick={() => dispatch(iscreate(!create))}><img src={edit} /></button>
            <Navbar/>
            <MyPostMenu/>
            <ProfileEdit/>
            <CreatePost/>
            <EditPost/>
            <Posts myposts={true}/>
            <Footer/>
        </div>
  )
}
