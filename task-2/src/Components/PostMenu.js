import React, { useEffect, useState } from 'react'
import '../Styles/PostMenu.css'
import { useDispatch, useSelector } from 'react-redux';
import { iscreate } from '../Redux/Slices/CreatePostSlice';
import axios from 'axios';
import { setfilter } from '../Redux/Slices/FilterSlice';

export default function PostMenu() {
    const postsall = useSelector((state)=>state.posts.allp);
    const url = useSelector((state)=>state.backend.url);
    const [allposts,setAllPosts] = useState(null);
    const [user,setuser] = useState(null);
          
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get(`${url}/api/posts`);  // Replace with your backend URL
            setAllPosts(response.data.posts);
   
          } catch (err) {
           
          }
        };
    
        fetchPosts();
      }, [[postsall]]);

    const dispatch = useDispatch();
    const filter = useSelector((state)=>state.filter.value);
    const create = useSelector((state)=>state.create.value);
      

    return (
        <div style={{rowGap:'20px',maxWidth:"1100px"}} className='posts px-xl-4 m-0 mx-auto navbar justify-content-center d-flex align-items-end'>
            <div style={{width:'90%',gap:'20px'}} className='tags d-flex align-items-end'>
                <span className='cursor-pointer fw-bold' style={{borderBottom:'0.8px solid black'}}>{`All Posts(${allposts?.length})`}</span>
                <span className='cursor-pointer hov'>Article</span>

                <span className='cursor-pointer hov'>Education</span>
                <span className='cursor-pointer hov'>Job</span>
            </div>
            <div style={{width:'5%'}} className='butns1 d-flex justify-content-end' >
                <select className='filter cursor-pointer' onClick={()=>dispatch(iscreate(!create))}>
                    <option selected>Write a Post</option>
                </select>
            </div>
            <div className='small-tags justify-content-between align-items-center px-2'>
                <p className='fw-bold' style={{marginTop:"22px"}}>{`All Posts(${allposts?.length})`}</p>
                <select className='filter'>
                    <option>Filter: All</option>
                    <option>Write Post</option>
                </select>
            </div>
        </div>
    )
}
