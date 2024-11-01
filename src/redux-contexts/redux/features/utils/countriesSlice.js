import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://restcountries.com/v3.1/' }),
  endpoints: builder => ({
    getCountries: builder.query({
      query: () => 'all',
    }),
  }),
});

export const { useGetCountriesQuery } = countryApi;

export const countrySlice = createSlice({
  name: 'countries',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        action =>
          action.type.startsWith('countryApi/') && ['pending', 'fulfilled', 'rejected'].includes(action.meta.requestStatus),
        (state, action) => {
          state.status = action.meta.requestStatus;
          state.error = action.error ? action.payload : null;
        }
      );
  },
});

// Export the reducer
export default countrySlice.reducer;
