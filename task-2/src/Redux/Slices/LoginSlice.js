import { createSlice } from '@reduxjs/toolkit'

export const LoginSlice = createSlice({
  name: 'login',
  initialState:{
    value:""
  },
  reducers: {
    islogin:(state,action)=>{
        state.value = !action.payload
    }

  },
})

export const { islogin} = LoginSlice.actions

export default LoginSlice.reducer