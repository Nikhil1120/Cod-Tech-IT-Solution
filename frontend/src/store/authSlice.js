import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: token || null, user: user },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      localStorage.setItem('access_token', state.token)
    },
    setUser(state, action) {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
  },
})

export const { setToken, setUser, logout } = authSlice.actions
export default authSlice.reducer
