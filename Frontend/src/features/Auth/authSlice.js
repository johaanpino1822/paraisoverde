import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // ✅ Solo guarda la información del usuario
      state.userInfo = action.payload.user;
      localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      // ✅ Guarda también el token por separado si deseas
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
