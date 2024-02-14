import { IApiResponse } from "../interfaces/IApiResponse";

export default class AppError {
    public handleErrorResponse<T = { message: string }>(error: any): IApiResponse<T> {
        if (error.response && error.response.status) {
            const statusCode = error.response.status;
            const data = error.response.data

            return { statusCode, data };
        }

        return { statusCode: 500, data: { message: 'Internal Server Error' } as T };
    }
}