import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user',
  initialState:{
    value:null,
    isforgot:false
  },
  reducers: {
    setuser:(state,action)=>{
        state.value = action.payload
    },
    setisforgot:(state)=>{
      state.isforgot = !state.isforgot
  },

  },
})

export const { setuser,setisforgot} = UserSlice.actions

export default UserSlice.reducer