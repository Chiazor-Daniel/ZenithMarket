import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../api';
export const paymentDetailsApi = createApi({
  reducerPath: 'paymentDetailsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl:  BASE_URL,
  }),
  endpoints: (builder) => ({
    getPaymentDetails: builder.query({
      query: (token) => ({
        url: '/user/transaction/get-payment-details',
        headers: {
          'Content-Type': 'application/json',
          "x-token": token
        },
        params: {
          key: "Less Loved"
        }
      }),
    }),
  }),
});

export const { useGetPaymentDetailsQuery } = paymentDetailsApi;
