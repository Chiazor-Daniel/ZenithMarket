/* eslint-disable */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminAuthReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import userAccountReducer from '../features/account/accountSlice';
import paymentDetailsReducer from '../features/payment-details/paymentSlice';
import { paymentDetailsApi } from '../services/paymentDetails';
import { profileApi } from '../services/profile';
import  countryReducer  from '../features/utils/countriesSlice';
import { userAccountApi } from '../services/account';
import { countryApi } from '../features/utils/countriesSlice';
import { transactionsApi } from '../services/transactions';
import adminAuthSlice from '../features/auth/admin-authSlice';
import { adminApi } from '../services/admin';
import { tradeDetailsApi } from '../services/trades';
import { setupListeners } from '@reduxjs/toolkit/query/react';

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthSlice,
    profile: profileReducer,
    paymentDetails: paymentDetailsReducer,
    userAccount: userAccountReducer,
    country: countryReducer,
    [paymentDetailsApi.reducerPath]: paymentDetailsApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [userAccountApi.reducerPath]: userAccountApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [tradeDetailsApi.reducerPath]: tradeDetailsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      profileApi.middleware,
      userAccountApi.middleware,
      adminApi.middleware,
      paymentDetailsApi.middleware,
      transactionsApi.middleware,
      tradeDetailsApi.middleware 
    ),
});

setupListeners(store.dispatch);

export default store;
