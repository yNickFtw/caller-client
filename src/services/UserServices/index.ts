import { api } from "@/api";
import AppError from "@/shared/helpers/AppError";
import { IApiResponse } from "@/shared/interfaces/IApiResponse";

export default class UserService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async create(body: any): Promise<IApiResponse> {
        try {
            const response = await api.post('/users/create', body)

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async authenticate(body: any): Promise<IApiResponse> {
        try {
            const response = await api.post('/users/authenticate', body)

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }
}
