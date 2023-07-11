export interface IUser {
    id: number
    lastname: string
    firstname: string
    middlename: string
    label: string
    email: string
    isBlocked: boolean
    creationDateTime: string
    modifyDateTime: string | null
    groups: IGroup[]
}

export interface IGroupBase {
    id: number,
    name: string,
    label: string,
    creationDateTime: string,
    modifyDateTime: string| null
}
export interface IGroup extends IGroupBase {
    isAdministrator: boolean
    dashboardAccess: boolean
    canDeleteFolder: boolean
    canDeleteDocument: boolean
    canDeleteBatch: boolean
    canSaveScanProfile: boolean
    canReclasifyDocumentsFolders: boolean
    canStartMultipleInstances: boolean
    users: IUser[]
    modules: IModule[]
    batchClasses: IBatchClassBase[]
}

export interface IModule {
    id: number
    name: string
}

export interface IBatch {
    id: number
    name: string
    userComment: string | null
    folders: IFolder[]
    batchClass: IBatchClass
}

export interface IBatchClassBase {
    id: number
    name: string
}
export interface IBatchClass {
    id: number
    name: string
    label: string
    defaultBatchName: string
    defaultCamundaProcess: null
    needClearFields: boolean
    isDeleted: boolean
    storageType: storageType
    validationRulesList: IValidationRulesList
    batchClassFields: IBatchClassField[]
    documentClasses: IDocumentClass[]
    folderClasses: IFolderClass
}
export interface IBatchClassField {
    id: number
    name: string
    label:string
    defaultValue: string | null
    isHidden: boolean
    isNullable: boolean
    fieldType: fieldType
}

export interface IDocument {
    id: number
    label: number
    docNo: number
    userComment: string
    docClass: {
        id: number
        name: string
    }
    pages: IPage[]
}
export interface IDocumentClass {
    id: number
    name: string
    label: string
    defaultLabel: string
    isDeleted: boolean
    isNeedFullOcr: boolean
    isNeedFieldsRecognition: boolean
    isNeedPdfconvertion: boolean
    fullOcrSettingsId: number
    pdfConvertionSettingsId: number
    validationRulesListId: number
    documentClassFields: IDocumentClassField[]
}
export interface IDocumentClassField {
    id: number
    name: string
    label: string
    defaultValue: string | null
    minimumConfidence: number
    isHidden: boolean
    isNullable: boolean
    isNeedRecognition: boolean
    fieldType: fieldType
}

export interface IFolder {
    id: number
    name: string
    label: string
    folderNo: number
    folderClassName: string
    userComment: string
    documents: IDocument[]
}

export interface IFolderClass {
    id: number
    name: string
    label: string
    folderClassFields: IFolderClassField[]
}
export interface IFolderClassField {
    id: number
    name: string
    label: string
}
export interface IFolderFields {
    id: number
    name: string
    label: string
    value: string
    isValid: boolean
    isHidden: boolean
    isNullable: boolean
    fieldType: fieldType | null
}

export interface IPageBase {
    id: number
    pageNo: number
    thumbnailBytes: string
    label: string
}
export interface IPage extends IPageBase{
    fileExtension: string
    originalFilePath: string
    originalFileBytes: string
    tempJpgFilePath: string
    tempJpgFileBytes: string
    tempFilePath: string
    tempFileBytes: string | null
    preProcessingSettings: string | null
    width: number
    height: number
    technicalComment: string
    userComment: string
}

export interface IResponseBase<T> {
    succeeded: boolean
    message: string
    errors: string | null
    data: T
}

export interface ICreationModule {
    id: number
    name: string
}

export interface IValidationRulesList {
    id: number
    name: string
}

export interface IDevice {
    driver: string;
    api_version: string;
}

export type fieldType = {
    id: number
    name: string
    label: string
}
export type storageType = {
    id: number
    name: string
}
