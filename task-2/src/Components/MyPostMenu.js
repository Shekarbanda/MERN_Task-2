import React from 'react'
import '../Styles/PostMenu.css'
import { useDispatch, useSelector } from 'react-redux';
import { iscreate } from '../Redux/Slices/CreatePostSlice';

export default function MyPostMenu() {
    const dispatch = useDispatch();

    const create = useSelector((state) => state.create.value);
    const isuser = useSelector((state) => state.user.value);

    return (
        <div style={{ rowGap: '20px', maxWidth: "1100px" }} className='posts px-xl-4 m-0 mx-auto navbar justify-content-center d-flex align-items-end'>
            <div style={{ width: '90%', gap: '20px' }} className='tags d-flex align-items-end'>
                <span className='cursor-pointer fw-bold' style={{ borderBottom: '0.8px solid black' }}>My Posts</span>

            </div>
            <div style={{ width: '5%' }} className='butns1 d-flex justify-content-end' >
                <select className='filter cursor-pointer' onClick={() => dispatch(iscreate(!create))}>
                    <option selected>Write a Post</option>
                </select>
            </div>
            <div className='small-tags justify-content-between align-items-center px-2'>
                <p className='fw-bold' style={{ marginTop: "22px" }}>My Posts</p>
                <select className='filter'>
                    <option>Filter: All</option>
                    <option>Education</option>
                    <option>Article</option>
                    <option>Job</option>
                </select>
            </div>
        </div>
    )
}
