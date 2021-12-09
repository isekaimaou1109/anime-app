import { createSlice } from '@reduxjs/toolkit'

export const expandingSlice = createSlice({
  name: 'expanding',
  initialState: {
    type: 'EXPAND',
    mode: true
  },
  reducers: {
    expanding(state, action) {
      return {
        ...state,
        type: action.payload.type,
        mode: action.payload.mode
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { expanding } = expandingSlice.actions
export default expandingSlice.reducer