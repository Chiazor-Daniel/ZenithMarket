import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../api';
export const userAccountApi = createApi({
  reducerPath: 'userAccountApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl:  BASE_URL,
  }),
  endpoints: (builder) => ({
    getUserAccount: builder.query({
      query: (token) => ({
        url: '/user/account/get-account/',
        headers: {
            'Content-Type': 'application/json',
            "x-token": token
        },
      }),
    }),
  }),
});

export const { useGetUserAccountQuery } = userAccountApi;
