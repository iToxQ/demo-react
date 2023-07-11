import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from '../store/store'
import { ICustomError } from "./interface/IAuthService";
import { ICreateGroupRequest, ICreateGroupResponse, IFetchGroupResponse, IGetGroupResponse, IRemoveGroupResponse, IUpdateGroupRequest, IUpdateGroupResponse } from "./interface/IGroupService";
import { baseURL } from '../constants';

export const groupService = createApi({
    reducerPath: "groupService",
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

    tagTypes: ['Groups', 'Group'],

    endpoints: (builder) => ({
        fetchGroups: builder.query<IFetchGroupResponse, any>({
            query: () => ({
                url: `https://${baseURL}/api/Group?PageSize=1000`,
                method: "GET"
            }),
            providesTags: ['Groups']
        }), 
        createGroup: builder.mutation<ICreateGroupResponse, ICreateGroupRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Group/Create`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Groups']
        }),
        updateGroup: builder.mutation<IUpdateGroupResponse, IUpdateGroupRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Group/Update`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Groups', 'Group']
        }),
        removeGroup: builder.mutation<IRemoveGroupResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Group/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Groups']
        }),
        getGroup: builder.query<IGetGroupResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Group/${id}`,
                method: 'GET'
            }),
            providesTags: ['Group']
        }),
        
    }),
});

export const {
    useFetchGroupsQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useRemoveGroupMutation,
    useGetGroupQuery
} = groupService