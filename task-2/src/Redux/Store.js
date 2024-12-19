import { configureStore } from '@reduxjs/toolkit'
import popup from '../Redux/Slices/PopupSlice'
import loginslice from '../Redux/Slices/LoginSlice'
import createslice from '../Redux/Slices/CreatePostSlice'
import editslice from '../Redux/Slices/EditPostSlice'
import backendslice from './Slices/BackendLink';
import userslice from './Slices/UserSlice'
import allpostsslice from './Slices/AllPostsSlice'
import postsslice from './Slices/PostsSlice';
import filterslice from './Slices/FilterSlice'

export const store = configureStore({
  reducer: {
        check:popup,
        login:loginslice,
        create:createslice,
        edit:editslice,
        backend:backendslice,
        user:userslice,
        editpost:allpostsslice,
        posts:postsslice,
        filter:filterslice
  },
})
