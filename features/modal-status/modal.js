import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    type: 'UNKNOWN',
    modalStatus: false
  },
  reducers: {
    modal: (state, action) => ({ ...state, modalStatus: action.payload })
  }
})

// Action creators are generated for each case reducer function
export const { modal } = modalSlice.actions
export default modalSlice.reducer