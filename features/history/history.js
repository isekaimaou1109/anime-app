import { createSlice } from '@reduxjs/toolkit'

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    type: 'UNKNOWN',
    follow: []
  },
  reducers: {
    writeHistory(state, action) {
      if(action.payload.type == 'WRITE') {
        state.follow.push(action.payload)
      }

      if(action.payload.type == 'REMOVE') {
        state.follow.splice(action.payload.start, action.payload.start + 1)
      }

      if(action.payload.type == 'RESET') {
        state.follow = []
      }

      return state
    }
  }
})

// Action creators are generated for each case reducer function
export const { writeHistory } = historySlice.actions
export default historySlice.reducer