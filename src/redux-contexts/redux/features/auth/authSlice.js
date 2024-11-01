import { createSlice } from '@reduxjs/toolkit';

// Helper function to retrieve user info from sessionStorage
const getUserInfoFromStorage = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

const initialState = {
  loading: false,
  userInfo: getUserInfoFromStorage(),
  userToken: sessionStorage.getItem("token") || null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateState(state, action) {
      state.userInfo = action.payload;
      sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    updateAutoTrade(state, action) {
      state.userInfo.can_auto_trade = action.payload;
      sessionStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    loginStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.userInfo = action.payload.userInfo;
      state.userToken = action.payload.userToken;
      state.success = true;
      
      // Store user info in sessionStorage
      sessionStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
      // Store token with expiration time in sessionStorage
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
      sessionStorage.setItem("token", action.payload.userToken);
      sessionStorage.setItem("tokenExpiration", expirationTime);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    logout(state) {
      state.userInfo = null;
      state.userToken = null;
      state.success = false;
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenExpiration");
    },
    clearState(state) {
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenExpiration");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateState, clearState, updateAutoTrade } = authSlice.actions;
export default authSlice.reducer;
