import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bankDetails: [],
  cryptoDetails: [],
};

export const paymentDetailsSlice = createSlice({
  name: 'paymentDetails',
  initialState,
  reducers: {
    setBankDetails: (state, action) => {
      state.bankDetails = action.payload;
    },
    setCryptoDetails: (state, action) => {
      state.cryptoDetails = action.payload;
    },
  },
});

export const { setBankDetails, setCryptoDetails } = paymentDetailsSlice.actions;

export default paymentDetailsSlice.reducer;
