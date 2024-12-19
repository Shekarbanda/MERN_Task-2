import { createSlice } from '@reduxjs/toolkit'



export const EditPostSlice = createSlice({
  name: 'edit',
  initialState:{
    value:false,
    post:null,
  },
  reducers: {
    isedit:(state)=>{
        state.value = !state.value
    },
    setEditPost: (state, action) => {
      state.post = action.payload;
    },

  },
})


export const { isedit,setEditPost} = EditPostSlice.actions

export default EditPostSlice.reducer