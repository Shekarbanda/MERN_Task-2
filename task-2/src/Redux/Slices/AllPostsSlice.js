import { createSlice } from '@reduxjs/toolkit'

export const AllPostsSlice = createSlice({
  name: 'editpost',
  initialState:{
    value:null
  },
  reducers: {
    seteditpost:(state,action)=>{
        state.value = action.payload
    }

  },
})

export const { seteditpost} = AllPostsSlice.actions

export default AllPostsSlice.reducer