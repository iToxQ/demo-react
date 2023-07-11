import { IBatch, IBatchClass, IResponseBase, IUser } from './IService';

export interface ICreateBatchUIScanRequest {
    name: string
    batchClassId: number
    moduleId?: number
    priority: number
    batchFields: {
        value: string,
        batchClassFieldId: number
    }[]
}
export interface ICreateBatchUIScanResponse extends IResponseBase<IBatch | null> {}

export interface IFetchBatchRequest {
    ModuleId?: number
    string?: string
    SearchText?: string
    PageNumber?: number
    PageSize?: number
}
export interface IFetchBatchResponse extends IResponseBase<IFetchBatchResponseData[] | null> {}

export interface IGetBatchResponse extends IResponseBase<IBatch | null> {}


export interface IFetchBatchResponseData {
    id: number
    name: string
    description: string
    batchClass: IBatchClass
    status: number
    priority: number
    creationUser: IUser
    lastModifyUser: IUser | null
    creationDateTime: string
    modifyDateTime: string | null
    numberOfDocuments: number
    numberOfPages: number
}

export interface ICommentResponse {
    id: number;
    type: number;
    comment: string;
}

export interface ICommentRequest {
    data: number
    errors: string | null;
    message: string | null;
    succeeded: boolean;
}

export interface IRemovePage extends IResponseBase<boolean> {}