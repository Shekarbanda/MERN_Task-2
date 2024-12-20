import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Login.css'
import '../Styles/PostMenu.css'
import { AiOutlineShareAlt } from 'react-icons/ai';
import PostCard from './PostCard';
import ProfileCard from './ProfileCard';
import MyPostCard from './MyPostCard';

export default function Posts({ myposts, filterType }) {


    return (
        <div style={{ width: '100%', gap: '20px' }} className='maindiv d-flex justify-content-center'>
            <div>
                {
                    myposts ? <MyPostCard /> : <PostCard />
                }
            </div>
            <div className='d-none d-lg-block'>
                <ProfileCard />
            </div>
        </div>
    );
};


