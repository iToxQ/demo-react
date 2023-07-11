import { IGroup, IGroupBase, IResponseBase } from "./IService";

export interface IFetchGroupResponse {
    pageNumber: number,
    pageSize: number,
    recordsFiltered: number,
    recordsTotal: number,
    succeeded: boolean,
    message: string | null,
    errors: string | null,
    data: IGroupBase[]
}

export interface ICreateGroupResponse extends IResponseBase<IGroup | null> {
}
export interface ICreateGroupRequest {
    name: string
    label: string
    isAdministrator: boolean
    dashboardAccess: boolean
    canDeleteFolder: boolean
    canDeleteDocument: boolean
    canDeleteBatch: boolean
    canSaveScanProfile: boolean
    canReclasifyDocumentsFolders: boolean
    canStartMultipleInstances: boolean
}

export interface IUpdateGroupResponse extends IResponseBase<IGroup | null> {
}
export interface IUpdateGroupRequest extends ICreateGroupRequest {
    id: number
}

export interface IRemoveGroupResponse extends IResponseBase<IGroup | null> {
}

export interface IGetGroupResponse extends IResponseBase<IGroup | null> {
}