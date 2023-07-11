import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store/store'
import { ICustomError, IUserResponse, ILoginRequest, ICreateUserResponse, ICreateUserRequest, IRemoveUserResponse, IUpdateUserRequest, IAccountResponse } from './interface/IAuthService'
import { IResponseBase } from './interface/IService'
import { baseURL } from '../constants';

export const authService = createApi({
    reducerPath: "authService",
    baseQuery: fetchBaseQuery({
        baseUrl: baseURL + "/auth",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authReducer.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, ICustomError, {}>,

    tagTypes: ['Auth', 'Users'],

    endpoints: (builder) => ({
        login: builder.mutation<IUserResponse, ILoginRequest>({
            query: (credentials) => ({
                url: `https://${baseURL}/api/Account/GetToken`,
                method: 'POST',
                body: credentials,
            }),
        }),
        createUser: builder.mutation<ICreateUserResponse, ICreateUserRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Account/Create`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Users']
        }),
        removeUser: builder.mutation<IRemoveUserResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Account/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users']
        }),
        updateUser: builder.mutation<IResponseBase<number | null>, IUpdateUserRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Account/Update`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: ['Users']
        }),
        fetchAccounts: builder.query<IAccountResponse, any>({
            query: () => ({
                url: `https://${baseURL}/api/Account?PageSize=1000`,
                method: "GET"
            }),
            providesTags: ['Users']
        }), 
    }),
})

export const {
    useLoginMutation,
    useCreateUserMutation,
    useRemoveUserMutation,
    useUpdateUserMutation,
    useFetchAccountsQuery
} = authService
