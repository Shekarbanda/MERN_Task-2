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
      state.allp = action.payload; // Set the updated post data
    },
    setmyp: (state, action) => {
        state.myp = action.payload; // Set the updated post data
      },
  },
});

export const { setallp,setmyp} = PostsSlice.actions;
export default PostsSlice.reducer;
