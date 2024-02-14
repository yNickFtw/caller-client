import AppError from "@/shared/helpers/AppError";
import { api } from "@/api";
import { IApiResponse } from "@/shared/interfaces/IApiResponse";

export default class ChannelService extends AppError {
    private appError: AppError;

    constructor(){
        super()
        this.appError = new AppError();
    }

    public async create(token: string, name: string, serverId: string, categoryId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/channels/create/${serverId}/${categoryId}`, { name }, {
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