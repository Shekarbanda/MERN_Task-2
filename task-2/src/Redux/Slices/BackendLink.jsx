import { createSlice } from "@reduxjs/toolkit";


const BackendLink = createSlice({
    name:'backend',
    initialState:{
        url:"http://localhost:8000"
    },
    reducers:{
        getLink:(state)=>{
            state.url = "http://localhost:8000"
        }
    }
})

export const {getLink} = BackendLink.actions;
export default BackendLink.reducer;