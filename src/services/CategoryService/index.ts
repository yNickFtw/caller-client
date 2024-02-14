import { IApiResponse } from "@/shared/interfaces/IApiResponse";
import AppError from "@/shared/helpers/AppError";
import { api } from "@/api";

export default class CategoryService extends AppError {
    private appError: AppError

    constructor(){
        super()
        this.appError = new AppError();
    }

    public async findAllCategoriesAndChannels(token: string, serverId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/categories/find/all/by/${serverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

}