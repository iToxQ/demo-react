import { IDocumentClass, IResponseBase } from './IService';

export interface IStatus {
    name: string;
    code: string;
    data: string | null;
}

export interface IDocumentMultiImportResponse extends IResponseBase<number | null> {}
export interface IDocumentMultiImportRequest {
    DocumentId: number;
    File: any;
    Hash: string;
}

export interface IGetDocumentRequestStatusResponse extends IResponseBase<IStatus | null> {}

export interface IRemoveDocumentResponse extends IResponseBase<boolean> {}

export interface ICreateDocumentResponse extends IResponseBase<boolean> {}
export interface ICreateDocumentRequest {
    moduleId: number;
    folderId: number;
    documentClassId: number;
}

export interface IGetDocumentClassesResponse extends IResponseBase<IDocumentClass[] | null> {}

export interface IDocumentMoveResponse extends IResponseBase<boolean> {}
export interface IDocumentMoveRequest {
    documentsInfo: {
        documentId: number,
        newDocNum: number
    }[];
    newFolderId: number;
}