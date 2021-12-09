import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    type: 'SEARCH',
    value: ''
  },
  reducers: {
    search(state, action) {
      if(action.payload.type == 'SEARCH') {
        state.value = action.payload.key
        return state
      } else {
        return state
      }
    }
  }
})

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    type: 'PUSH',
    data: []
  },
  reducers: {
    data(state, action) {
      if(action.payload.type == 'PUSH') {
        state.data = action.payload.doc
        return state
      } else {
        return state
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { search } = searchSlice.actions
export const { data } = dataSlice.actions
export default function() { 
  return ({ 
    search: searchSlice.reducer,
    data: dataSlice.reducer
  })
}