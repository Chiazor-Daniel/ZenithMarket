/* eslint-disable */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../api';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: (token) => ({
        url: '/admin/super-admin/get-all-admins/',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,
        },
      }),
    }),
    getSingleAdmin: builder.query({
      query: ({ id, adminToken }) => {
        return {
          url: `/admin/super-admin/view-admin/${id}/`,
          headers: {
            'Content-Type': 'application/json',
            'x-token': adminToken,
          },
        };
      },
    }),
    getAllUsers: builder.query({
      query: (token) => ({
        url: '/admin/user/get-all-users/',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,
        },
      }),
    }),
    getSingleUser: builder.query({
      query: ({ id, adminToken }) => {
        return {
          url: `/admin/user/view-user/${id}/`,
          headers: {
            'Content-Type': 'application/json',
            'x-token': adminToken,
          },
        };
      },
    }),
    assignUserToAdmin: builder.mutation({
      query: ({ userId, adminId, adminToken, assign }) => ({
        url: `/admin/super-admin/assign-user-to-admin/?user_id=${userId}&admin_id=${adminId}&assign_task=${assign}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'x-token': adminToken,
        },
      }),
    }),
    updateUserTransaction: builder.mutation({
      query: ({ token, user_id, transaction_id, transaction_status }) => {
        return {
          url: `/admin/user/change-transaction-status/${transaction_id}?user_id=${user_id}&status_=${transaction_status}`,
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }

        }
      }
    }),
    makeNewTransaction: builder.mutation({
      query: ({ token, user_id, amount, balance_type, transaction_type }) => {
        return {
          url: `/admin/user/make-transaction/?user_id=${user_id}&amount=${amount}&balance_type=${balance_type}&transaction_type=${transaction_type}`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }

        }
      }
    }),
    editUseretails: builder.mutation({
      query: ({ token, user_id, userDetails }) => {
        return {
          url: `/admin/user/edit-user-details/${user_id}`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          },
          body: userDetails
        }
      }
    }),
    resetUserPassword: builder.mutation({
      query: ({ token, user_id }) => {
        return {
          url: `/admin/user/reset-user-password/${user_id}`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            "x-token": token
          }
        }
      }
    }),
    createBankDetails: builder.mutation({
      query: ({ token, key, bank_name, account_name, iban, bic, reference }) => {
        const queryString = new URLSearchParams({
          key,
          bank_name,
          account_name,
          iban,
          bic,
          reference
        }).toString();

        return {
          url: `/admin/finance-details/create-bank-details/?${queryString}`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }
        }
      }
    }),
    editBankDetails: builder.mutation({
      query: ({ token, bank_id, key, bankDetails }) => {
        console.log({ token, bank_id, key, bankDetails });
        return {
          url: `/admin/finance-details/edit-bank-details/${bank_id}/?key=${key}`,
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          },
          body: {
            bank_name: bankDetails.bank_name,
            account_name: bankDetails.account_name,
            iban: bankDetails.iban,
            bic: bankDetails.bic,
            reference: bankDetails.reference,
            owner: bankDetails.owner  // Include the owner property
          }
        };
      }
    }),
    
    createCryptoDetails: builder.mutation({
      query: ({ token, wallet_address, preferred_token, network_chain, key }) => {
        return {
          url: `/admin/finance-details/create-crypto-details/?key=${key}`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }, 
          body: {wallet_address, preferred_token, network_chain}
        }
      }
    }),
    editCryptoDetails: builder.mutation({
      query: ({ token, crypto_id, key, crypto }) => {
        console.log({ token, crypto_id, key, crypto })
        return {
          url: `/admin/finance-details/edit-crypto-details/${crypto_id}?key=${"Less Loved"}`,
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }, 
          body: {
            wallet_address: crypto.wallet_address,
            preferred_token: crypto.preferred_token,
            network_chain: crypto.network_chain
          }
        }
      }
    }),
    loginUser: builder.mutation({
      query: ({ token, user_id }) => {
        return {
          url: `/admin/user/login-user/${user_id}`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            "x-token": token
          }
        }
      }
    }),
    getAllLeads: builder.query({
      query: ({token, admin_id}) => {
        return {
          url: `/admin/crm/get-all-leads/?admin_id=${admin_id}`,
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }
        }
      }
    }),
    getSingleLead: builder.query({
      query: ({ token, lead_id, admin_id }) => {
        return {
          url: `/admin/crm/view-lead/${lead_id}?admin_id=${admin_id}`,
          headers: {
            "x-token": token
          }
        }
      }
    }),
    editLead: builder.mutation({
      query: ({ token, firstName, lastName, email, phoneNumber, status, country, address, dateOfBirth, activated, lead_id, admin_id }) => {
        const queryParams = new URLSearchParams({
          email,
          first_name: firstName,
          last_name: lastName,
          address,
          country,
          admin_id: admin_id,
          phone_number: phoneNumber,
          date_of_birth: dateOfBirth,
          status,
          activated: activated.toString() // Convert boolean to string
        });
        return {
          url: `/admin/crm/edit-lead/${lead_id}?${queryParams.toString()}`,
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }
        }
      }
    }),
    createLead: builder.mutation({
      query: ({ token, formData }) => {
        const queryParams = new URLSearchParams({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: parseInt(formData.phoneNumber),
          status: formData.status,
          country: formData.country,
          address: formData.address,
          date_of_birth: formData.dateOfBirth,
          activated: true,
          created_at: formData.createdAt
        });

        const url = `/admin/crm/create-lead/?${queryParams.toString()}`;

        return {
          url,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }
        }
      }
    }),
    activateLead: builder.mutation({
      query: ({ lead_id, token, admin_id }) => {
        return {
          url: `/admin/crm/activate-lead/${lead_id}?admin_id=${admin_id}`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }
        }
      }
    }),
    deleteLead: builder.mutation({
      query: ({ lead_id, token, admin_id }) => {
        return {
          url: `/admin/crm/delete_lead/${lead_id}?admin_id=${admin_id}`,
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }
        }
      }
    }),
    viewComments: builder.query({
      query: ({token, admin_id, lead_id}) => {
        return{
          url: `/admin/crm/view-comment/${lead_id}?admin_id=${admin_id}`,
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          }
        }
      }
      }), 
      addComments: builder.mutation({
        query: ({token, admin_id, lead_id, comment})=>{
          const queryString = new URLSearchParams({ admin_id, comment })
          return{
            url: `/admin/crm/add-comment/${lead_id}?admin_id=${admin_id}&comment=${comment}`, 
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'x-token': token,
            }
          }
        }
      }), 
      assignLeadToAdmin: builder.mutation({
        query: ({ token, lead_id, admin_id, assign_task }) => {
          const queryString = new URLSearchParams({
            token: token,
            lead_id: lead_id,
            admin_id: admin_id,
            assign_task: assign_task,
          })
          return {
            url: `/admin/super-admin/assign-lead-to-admin/?${queryString}`,
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'x-token': token,
            }
          };
        },
      }), 
      createAdmin: builder.mutation({
        query: ({ token, details }) => {
          console.log("redux", details); // Logging details for verification
      
          return {
            url: "https://finno-api.finnovent.com/admin/super-admin/create-admin/",
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              "x-token": token
            },
            body: JSON.stringify({
              "email": details.email,
              "first_name": details.first_name,
              "last_name": details.last_name,
              "address": details.address,
              "country": details.country,
              "phone_number": details.phone_number,
              "date_of_birth": details.date_of_birth,
              "password": details.password
            })
          };
        }
      }), 
      createCustomProfit: builder.mutation({
        query: ({trade_id, user_id, profit, token})=>{
          const queryString = new URLSearchParams({trade_id, user_id, profit})
          return{
            url: `/admin/user/add-custom-profit/${trade_id}?${queryString}`,
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              "x-token": token
            },
          }
        }
      }),
      updateAccountType: builder.mutation({
        query: ({token, user_id, admin_id, account_types})=>{
          const queryString = new URLSearchParams({admin_id, account_types})
          return{
            url: `/admin/user/change-account-type/${user_id}?${queryString}`, 
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              "x-token": token
            },

          }
        }
      }), 
      getUserDocuments: builder.query({
        query: ({token, user_id}) => {
          return{
            url: `/admin/user/get-verification-document/${user_id}`, 
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              "x-token": token
            },
          }
        }
      }), 
      viewUserDocument: builder.query({
        query: ({token, user_id, file_id}) => {
          return{
            url: `/admin/user/view-verification-document/${user_id}`, 
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              "x-token": token
            },
          }
        }
      }), 
      verifyStatus: builder.mutation({
        query: ({token, user_id, status}) => {
          return{
            url: `/admin/user/change-verification-status/${user_id}?status_=${status}`, 
            method: 'PUT', 
            headers: {
              'Content-Type': 'application/json',
              "x-token": token
            },
          }
        }
      })
  }),
});

export const {
  useGetAllAdminsQuery,
  useViewUserDocumentQuery,
  useGetUserDocumentsQuery,
  useGetSingleAdminQuery,
  useGetAllUsersQuery,
  useVerifyStatusMutation,
  useGetSingleUserQuery, useUpdateAccountTypeMutation,
  useUpdateUserTransactionMutation,useCreateAdminMutation,useEditBankDetailsMutation,useCreateCustomProfitMutation,
  useAssignUserToAdminMutation, useMakeNewTransactionMutation, useEditUseretailsMutation, useResetUserPasswordMutation, useCreateBankDetailsMutation, useLoginUserMutation,
  useGetAllLeadsQuery,useViewCommentsQuery, useAddCommentsMutation,useAssignLeadToAdminMutation,useEditCryptoDetailsMutation,
  useGetSingleLeadQuery, useEditLeadMutation, useCreateLeadMutation, useActivateLeadMutation, useDeleteLeadMutation, useCreateCryptoDetailsMutation
} = adminApi;
