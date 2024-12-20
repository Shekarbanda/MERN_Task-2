// In EditPostSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allp: null, 
myp:null
};

const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setallp: (state, action) => {
      state.allp = action.payload; 
    },
    setmyp: (state, action) => {
        state.myp = action.payload; 
      },
  },
});

export const { setallp,setmyp} = PostsSlice.actions;
export default PostsSlice.reducer;
