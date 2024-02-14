import { api } from "@/api";
import AppError from "@/shared/helpers/AppError";
import { IApiResponse } from "@/shared/interfaces/IApiResponse";

export default class ServerService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async create(formData: FormData, token: string): Promise<IApiResponse> {
        try {
            const response = await api.post('/servers/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllServersOfUser(token: string): Promise<IApiResponse> {
        try {
            const response = await api.get('/servers/find/all/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllServersOfCommunity(token: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/servers/find/all/community`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findServerById(serverId: string, token: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/servers/find/by/id/${serverId}`, {
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