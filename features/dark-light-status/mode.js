import { createSlice } from '@reduxjs/toolkit'

export const switchingSlice = createSlice({
  name: 'switching',
  initialState: {
    type: 'LIGHT',
    mode: true
  },
  reducers: {
    switching(state, action) {
      return {
        ...state,
        type: action.payload.type,
        mode: action.payload.mode
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { switching } = switchingSlice.actions
export default switchingSlice.reducer