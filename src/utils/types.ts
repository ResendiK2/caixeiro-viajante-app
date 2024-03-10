export interface IClient {
    id?: string
    name: string
    email: string
    phone: string
    coordinate_x: number
    coordinate_y: number
}

export interface ICreateService {
    success: boolean,
    response?: IClient
}

export interface IGetService {
    success: boolean,
    response?: IClient[]
}