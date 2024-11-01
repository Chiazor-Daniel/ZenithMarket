import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: null,
  account_type: "",
  referral_balance: 0,
  id: null,
  main_balance: 0,
  bonus_balance: 0
};

export const userAccountSlice = createSlice({
  name: 'userAccount',
  initialState,
  reducers: {
    setUserAccount: (state, action) => {
      const { user_id, account_type, referral_balance, id, main_balance, bonus_balance } = action.payload;
      state.user_id = user_id;
      state.account_type = account_type;
      state.referral_balance = referral_balance;
      state.id = id;
      state.main_balance = main_balance;
      state.bonus_balance = bonus_balance;
    },
  },
});

export const { setUserAccount } = userAccountSlice.actions;

export default userAccountSlice.reducer;
