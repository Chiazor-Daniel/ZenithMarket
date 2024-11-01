import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  userInfo: null,
  error: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { updateProfileInfo, setLoading, setError } = profileSlice.actions;

export default profileSlice.reducer;
