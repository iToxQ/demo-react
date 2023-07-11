import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from '../store/store'
import { ICustomError } from "./interface/IAuthService";
import { baseURL } from '../constants';
import { ICreateFolderRequest, ICreateFolderResponse, IRemoveFolderResponse } from './interface/IFolderService';

export const folderService = createApi({
    reducerPath: "folderService",
    baseQuery: fetchBaseQuery({
        baseUrl: baseURL + "/auth",
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).authReducer.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, ICustomError, {}>,

    tagTypes: ['Folder'],

    endpoints: (builder) => ({
        removeFolder: builder.mutation<IRemoveFolderResponse, number[]>({
            query: (ids) => ({
                url: `https://${baseURL}/api/Folder`,
                method: 'DELETE',
                body: ids
            }),
            invalidatesTags: ['Folder']
        }),
        createFolder: builder.mutation<ICreateFolderResponse, ICreateFolderRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Folder/Create`,
                method: 'POST',
                body: body
            })
        }),
    }),
});

export const {
    useRemoveFolderMutation,
    useCreateFolderMutation
} = folderService