export interface IClient {
    id?: string
    name: string
    email: string
    phone: string
    coordinate_x: number | string
    coordinate_y: number | string
}

export interface ICreateService {
    success: boolean,
    response?: IClient
    error?: string
}

export interface IGetService {
    success: boolean,
    response?: IClient[]
}