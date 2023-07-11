import { IResponseBase } from './IService';

export interface IRemoveFolderResponse extends IResponseBase<boolean> {}


export interface ICreateFolderResponse extends IResponseBase<any> {}
export interface ICreateFolderRequest {
    moduleId: number;
    batchId: number;
    folderClassId: number;
}

export interface IFolderMoveRequest {
    foldersInfo: {
        folderId: number,
        newFolderNum: number
    }[];
}