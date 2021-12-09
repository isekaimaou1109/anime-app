import { createSlice } from '@reduxjs/toolkit'

export const formSlice = createSlice({
  name: 'process',
  initialState: {
    type: 'UNKNOWN',
    isLogined: false,
    username: null,
    clientId: null,
    avatarUri: null
  },
  reducers: {
    process(state, action) {
      console.log('state still run into this ' + JSON.stringify(action.payload))
      if(action.payload.type == 'LOGIN') {
        if('username' in action.payload && 'clientId' in action.payload && 'avatarUri' in action.payload) {
          return {
            ...state,
            type: 'LOGIN',
            isLogined: action.payload.isLogined,
            username: action.payload['username'],
            clientId: action.payload['clientId'],
            avatarUri: action.payload['avatarUri'],
          }
        }
      } else {
        return state
      }
    },

    getClientId(state, action) {
      if(action.type.payload == 'GET') {
        return { ...state }
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { process, getClientId } = formSlice.actions
export default formSlice.reducer