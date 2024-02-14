export interface IApiResponse<T = {} | [] | any> {
    statusCode: number;
    data: T
}