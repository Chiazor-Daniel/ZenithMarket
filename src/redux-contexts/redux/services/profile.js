import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../api';
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({ baseUrl:  BASE_URL }),
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/user/profile/users/', 
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
          url: `/user/profile/users/`,
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              "x-token": userData.token
          },
          params: {
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              phone_number: userData.phone_number,
              date_of_birth: userData.date_of_birth,
              country: userData.country,
              address: userData.address,
          },
      }),
  }),
    changePassword: builder.mutation({
      query: ({ token, newPassword, oldPassword }) => ({
        url: '/user/profile/users/change-password/', 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "x-token": token
        },
        params: { old_password: oldPassword ,new_password: newPassword },
      }),
    }),
    verfiyID: builder.mutation({
      query: ({ token , images}) => {
        console.log(images)
        return{
        url: '/user/verify-documentupload-verification-document', 
        method: 'POST',
        body: images, 
        headers: {
          // 'Content-Type': 'multipart/form-data',
          "x-token": token
        },
      }}
    })
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useVerfiyIDMutation } = profileApi;
