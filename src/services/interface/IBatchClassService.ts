import { IBatchClass, IFolderClass, IResponseBase } from './IService';

export interface IFetchBatchClassesResponse extends IResponseBase<IBatchClass[] | null> {
    pageNumber: number
    pageSize: number
    recordsFiltered: number
    recordsTotal: number
}

export interface IGetBatchClassResponse extends IResponseBase<IBatchClass | null> {}

export interface IGetFolderClassesResponse extends IResponseBase<IFolderClass[] | null> {}