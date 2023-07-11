import { IPage, IResponseBase } from './IService';

export interface IGetPageResponse extends IResponseBase<IPage | null> {}

export interface IRemovePage extends IResponseBase<boolean> {}

export interface IPageMoveResponse extends IResponseBase<boolean> {}
export interface IPageMoveRequest {
    pagesInfo: {
        pageId: number,
        newPageNum: number
    }[];
    newDocumentId: number;
}