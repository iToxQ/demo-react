import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from '../store/store'
import { ICustomError } from "./interface/IAuthService";
import { baseURL } from '../constants';
import {
    IGetDocumentRequestStatusResponse,
    IDocumentMultiImportRequest,
    IDocumentMultiImportResponse,
    IDocumentMoveResponse,
    IDocumentMoveRequest,
    IRemoveDocumentResponse,
    ICreateDocumentResponse, ICreateDocumentRequest, IGetDocumentClassesResponse
} from './interface/IDocumentService';

export const documentService = createApi({
    reducerPath: "documentService",
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

    tagTypes: ['Document', 'Status', 'DocumentClasses'],

    endpoints: (builder) => ({
        documentMultiImport: builder.mutation<IDocumentMultiImportResponse, IDocumentMultiImportRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Document/MultiImport`,
                method: 'POST',
                body: body,
            }),
        }),
        getDocumentRequestStatus: builder.query<IGetDocumentRequestStatusResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Document/RequestStatus/?requestId=${id}`,
                method: 'GET',
            }),
            providesTags: ['Status']
        }),
        removeDocument: builder.mutation<IRemoveDocumentResponse, number[]>({
            query: (ids) => ({
                url: `https://${baseURL}/api/Document`,
                method: 'DELETE',
                body: ids
            }),
            invalidatesTags: ['Document']
        }),
        moveDocument: builder.mutation<IDocumentMoveResponse, IDocumentMoveRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Document/Move`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Document']
        }),
        createDocument: builder.mutation<ICreateDocumentResponse, ICreateDocumentRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Document/Create`,
                method: 'POST',
                body: {
                    ...body,
                    moduleId: 9
                }

            }),
            invalidatesTags: ['Document']
        }),
        getDocumentClass: builder.query<IGetDocumentClassesResponse, number>({
            query: (batchClassId) => ({
                url: `https://${baseURL}/api/DocumentClass?pageNumber=1&recordsPerPage=9999&batchClassId=${batchClassId}`,
                method: 'GET'
            }),
            providesTags: ['DocumentClasses']
        }),
    }),
});

export const {
    useDocumentMultiImportMutation,
    useGetDocumentRequestStatusQuery,
    useRemoveDocumentMutation,
    useMoveDocumentMutation,
    useCreateDocumentMutation,
    useGetDocumentClassQuery
} = documentService