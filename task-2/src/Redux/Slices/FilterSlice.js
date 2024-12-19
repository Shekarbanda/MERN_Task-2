import { createSlice } from '@reduxjs/toolkit'

export const FilterSlice  = createSlice({
  name: 'filter',
  initialState:{
    value:"all"
  },
  reducers: {
    setfilter:(state,action)=>{
        state.value = action.payload
    }

  },
})

export const { setfilter} = FilterSlice.actions

export default FilterSlice.reducer