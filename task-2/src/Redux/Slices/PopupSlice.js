import { createSlice } from '@reduxjs/toolkit'



export const PopupSlice = createSlice({
  name: 'check',
  initialState:{
    value:false
  },
  reducers: {
    ischeck:(state)=>{
        state.value = !state.value
    }

  },
})


export const { ischeck} = PopupSlice.actions

export default PopupSlice.reducer