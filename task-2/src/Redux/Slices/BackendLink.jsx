import { createSlice } from "@reduxjs/toolkit";


const BackendLink = createSlice({
    name:'backend',
    initialState:{
        url:"https://mern-task-2-460x.onrender.com"
    },
    reducers:{
        getLink:(state)=>{
            state.url = "http://localhost:8000"
        }
    }
})

export const {getLink} = BackendLink.actions;
export default BackendLink.reducer;
