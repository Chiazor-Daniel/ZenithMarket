import { createSlice } from '@reduxjs/toolkit';

// Helper function to retrieve admin info from sessionStorage
const getAdminInfoFromStorage = () => {
  const adminInfo = sessionStorage.getItem("adminInfo");
  return adminInfo ? JSON.parse(adminInfo) : null;
};

const initialState = {
  loading: false,
  adminInfo: getAdminInfoFromStorage(),
  adminToken: sessionStorage.getItem("adminToken") || null,
  error: null,
  success: false,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    updateAdminState(state, action) {
      state.adminInfo = action.payload;
    },
    adminLoginStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    adminLoginSuccess(state, action) {
      state.loading = false;
      state.adminInfo = action.payload.adminInfo;
      state.adminToken = action.payload.adminToken;
      state.success = true;
      
      // Store admin info in sessionStorage
      sessionStorage.setItem("adminInfo", JSON.stringify(action.payload.adminInfo));
      // Store admin token with expiration time in sessionStorage
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
      sessionStorage.setItem("adminToken", action.payload.adminToken);
      sessionStorage.setItem("adminTokenExpiration", expirationTime);
    },
    adminLoginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    adminLogout(state) {
      state.adminInfo = null;
      state.adminToken = null;
      state.success = false;
      sessionStorage.removeItem("adminInfo");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminTokenExpiration");
    },
    clearAdminState(state) {
      state.loading = false;
      state.adminInfo = null;
      state.adminToken = null;
      state.error = null;
      state.success = false;
    },
  },
});

export const { adminLoginStart, adminLoginSuccess, adminLoginFailure, adminLogout, updateAdminState, clearAdminState } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
