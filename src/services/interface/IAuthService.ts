import { IUser, IResponseBase } from "./IService"

export interface IRegRequest {
    email: string
    password: string
}
export interface IRegResponse {
    data: {
        message: string
        statusCode: number
    },
    status: number
}

export interface IUserResponse {
    token: string
    user: any
}
export interface ILoginRequest {
    username: string
    password: string
}

export interface ICustomError {
    data: {
        message: string,
        status: string
    }
    status: string
}

export interface IAccountResponse {
    "pageNumber": number
    "pageSize": number
    "recordsFiltered": number
    "recordsTotal": number
    "succeeded": boolean
    "message": string | null
    "errors": string | null
    "data": IUser[]
}

export interface ICreateUserRequest {
    username: string
    password: string
    lastname: string
    firstname: string
    middlename: string
    label: string
    email: string
}
export interface ICreateUserResponse extends IResponseBase<number | null> {

}

export interface IRemoveUserResponse extends IResponseBase<number | null> {

}

export interface IUpdateUserRequest {
    id: number
    lastname: string
    firstname: string
    middlename: string
    label: string
    email: string
}
export interface IUpdateUserResponse extends IResponseBase<number | null> {

}