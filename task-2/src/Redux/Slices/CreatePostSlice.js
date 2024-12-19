import { createSlice } from '@reduxjs/toolkit'



export const EditPostSlice = createSlice({
  name: 'create',
  initialState:{
    value:false
  },
  reducers: {
    iscreate:(state)=>{
        state.value = !state.value
    }

  },
})


export const { iscreate} = EditPostSlice.actions

export default EditPostSlice.reducer